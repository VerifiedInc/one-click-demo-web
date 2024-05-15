import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from '@remix-run/node';
import Box from '@mui/material/Box';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

import { getErrorMessage, getErrorStatus } from '~/errors';
import {
  getSharedCredentialsOneClick,
  hasMatchingCredentials,
  oneClick,
  OneClickOptions,
} from '~/coreAPI.server';
import { config } from '~/config';
import { logger } from '~/logger.server';

import { getBrandSet } from '~/utils/getBrandSet';
import { rooms } from '~/utils/socket';
import { dateUtils } from '~/utils/date';

import { useIsOneClick } from '~/hooks/useIsOneClick';
import { useBrand } from '~/hooks/useBrand';
import { useIsOneClickNonHosted } from '~/hooks/useIsOneClickNonHosted';
import { RegularForm } from '~/features/register/components/RegularForm';
import { OneClickForm } from '~/features/register/components/OneClickForm';
import { LogInAndRegister } from '~/components/LoginAndRegister';
import { OneClickFormNonHosted } from '~/features/register/components/OneClickFormNonHosted';
import { logoutUseCase } from '~/features/logout/usecases/logoutUseCase';
import { mapOneClickOptions } from '~/features/oneClick/mappers/mapOneClickOptions';
import { findState } from '~/features/state/services/findState';
import { getBaseUrl } from '~/features/environment/helpers';

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request, context }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const formData = await request.formData();

  const action = formData.get('action');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const birthDate = (formData.get('birthDate') as string) || undefined;
  const apiKey = formData.get('apiKey');
  const redirectUrl = (formData.get('redirectUrl') as string) || undefined;
  const verificationOptions =
    searchParams.get('verificationOptions') || 'only_code';
  const isHosted = searchParams.get('isHosted') !== 'false' ?? true;

  const brandSet = await getBrandSet(
    context.prisma as PrismaClient,
    searchParams
  );

  const configStateParams = searchParams.get('configState');
  const configState = await findState(
    context.prisma as PrismaClient,
    configStateParams
  );

  if (!action) {
    return json({ error: 'Action must be populated' }, { status: 400 });
  }

  switch (action) {
    case 'reset': {
      return null;
    }
    case 'one-click': {
      if (!phone) {
        return json({ error: 'Phone must be populated' }, { status: 400 });
      }

      if (typeof phone !== 'string') {
        return json({ error: 'Invalid form data' }, { status: 400 });
      }

      try {
        logger.info(`calling oneClick with ${apiKey}`);

        // Format DDMM to YYYY-DD-MM to comply with on of the POST 1-click request body validation field
        const formatterdBirthDate = birthDate
          ? dateUtils.toYYYYDDMM(dateUtils.formatDateMMDD(birthDate))
          : undefined;

        let customOneClickOptions: Partial<OneClickOptions> = {};

        logger.debug(`configState: ${JSON.stringify(configState)}`);

        // Enforce the type of the custom one click options
        customOneClickOptions = mapOneClickOptions(
          configState?.state
        ) as Partial<OneClickOptions>;

        logger.debug(
          `custom one click options found: ${JSON.stringify(
            configState?.state
          )}`
        );

        const options: Partial<OneClickOptions> = {
          phone,
          birthDate: formatterdBirthDate,
          redirectUrl,
          verificationOptions:
            verificationOptions as OneClickOptions['verificationOptions'],
          isHosted,
          ...customOneClickOptions,
        };

        const result = await oneClick(options, {
          baseUrl: getBaseUrl(configState?.state.environment),
          accessToken: brandSet.apiKey,
          stateUuid: configState?.uuid,
          requestUrl: url,
        });

        logger.info(`oneClick result: ${JSON.stringify(result)}`);

        // If 1-click is hosted, and verification options is either code or both link and code,
        // redirect the user to the URL returned from the oneClick API.
        if (
          isHosted &&
          ['only_code', 'both_link_and_code'].includes(verificationOptions)
        ) {
          return redirect(result.url);
        }

        // Otherwise, display on UI the success message.
        return { ...result, success: true };
      } catch (e) {
        return json(
          { error: getErrorMessage(e) },
          { status: getErrorStatus(e) }
        );
      }
    }
    case 'regular': {
      if (!phone && !email) {
        return json(
          { error: 'Either phone or email must be populated' },
          { status: 400 }
        );
      }

      if (typeof email !== 'string' || typeof phone !== 'string') {
        return json({ error: 'Invalid form data' }, { status: 400 });
      }

      try {
        // Check whether the user has existing credentials
        const credentialRequestUrl = await hasMatchingCredentials(email, phone);

        // if url is returned then there are matching credentials
        if (credentialRequestUrl) {
          const url = new URL(String(credentialRequestUrl));

          // url to redirect the user to once the Unum ID credential request flow is complete
          url.searchParams.set('redirectUrl', config.demoUrl + '/register');

          logger.info(
            `final wallet URL including own callbackUrl aka redirectUrl defined: ${url}`
          );

          // redirect the user to the url returned from the POST request to hasMatchingCredentials
          return redirect(String(url));
        }
        // Alert for the purposes of the demo to inform users as to why the demo is not progressing
        return json({ error: 'No matching credentials found.' });
      } catch (e) {
        return json(
          { error: getErrorMessage(e) },
          { status: getErrorStatus(e) }
        );
      }
    }
  }
};

// The exported `loader` function will be called when the route makes a GET request, i.e. when it is rendered
export const loader: LoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url);
  const { searchParams } = url;
  const brandSet = await getBrandSet(
    context.prisma as PrismaClient,
    searchParams
  );

  const oneClickUuid = searchParams.get('1ClickUuid');
  const hasOptedOut = searchParams.get('optedOut') === 'true';
  const configStateParam = searchParams.get('configState');

  let configState = null;

  if (configStateParam) {
    const state = await findState(
      context.prisma as PrismaClient,
      configStateParam
    );
    configState = state;
  }

  if (oneClickUuid && !hasOptedOut) {
    const result = await getSharedCredentialsOneClick(oneClickUuid, {
      baseUrl: getBaseUrl(configState?.state.environment),
      accessToken: brandSet.apiKey,
    });
    if (result) {
      // Emit the 1-click successful event to the socket.io room.
      logger.debug(
        `Emitting 1-click-successful event to ${rooms.buildOneClickRoom(
          brandSet.brand,
          result
        )}`
      );
      (context.socketIo as Server)
        .to(rooms.buildOneClickRoom(brandSet.brand, result))
        .emit('1-click-successful', url.toString());

      const fullName = result?.credentials?.fullName;
      // Full name credential can be either a string or a record containing optionally the first name, last name, middle name.
      const firstName =
        typeof fullName === 'string' ? fullName : fullName?.firstName;

      // Because the user has canceled 1-click flow, the credentials was not shared, so we need to logout the user.
      // Customer Note: in a real implementation this ought to fall back to the standard sign up form.
      if (!firstName) return logoutUseCase({ request });

      return redirect(`/verified?${searchParams.toString()}`);
    }
  }

  // Remove the 1-click query params from the URL if the user has opted out.
  if (hasOptedOut) {
    url.searchParams.delete('1ClickUuid');
    url.searchParams.delete('optedOut');
    return redirect(url.toString());
  }

  return json({ configState });
};

export default function Register() {
  const isOneClick = useIsOneClick();
  const isOneClickNonHosted = useIsOneClickNonHosted();
  const brand = useBrand();

  return (
    <Box
      component='main'
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      {/* When is regular flow, render the default form */}
      {!isOneClick && <RegularForm />}
      {isOneClick && !isOneClickNonHosted && <OneClickForm />}
      {isOneClickNonHosted && <OneClickFormNonHosted />}
      <LogInAndRegister theme={brand.theme} sx={{ maxWidth: 264 }} />
    </Box>
  );
}
