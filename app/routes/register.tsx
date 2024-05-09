import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from '@remix-run/node';
import Box from '@mui/material/Box';
import { Server } from 'socket.io';

import { getErrorMessage, getErrorStatus } from '~/errors';
import {
  getMinifiedText,
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
import { JSONParseOrNull } from '~/utils/json';

import { useIsOneClick } from '~/hooks/useIsOneClick';
import { useBrand } from '~/hooks/useBrand';
import { useIsOneClickNonHosted } from '~/hooks/useIsOneClickNonHosted';
import { RegularForm } from '~/features/register/components/RegularForm';
import { OneClickForm } from '~/features/register/components/OneClickForm';
import { LogInAndRegister } from '~/components/LoginAndRegister';
import { OneClickFormNonHosted } from '~/features/register/components/OneClickFormNonHosted';
import { logoutUseCase } from '~/features/logout/usecases/logoutUseCase';
import { mapOneClickOptions } from '~/features/oneClick/mappers/mapOneClickOptions';
import { findStateByUuid } from 'prisma/state';

// The exported `action` function will be called when the route makes a POST request, i.e. when the form is submitted.
export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const formData = await request.formData();

  const action = formData.get('action');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const birthDate = (formData.get('birthDate') as string) || undefined;
  const apiKey = formData.get('apiKey');
  const redirectUrl = (formData.get('redirectUrl') as string) || undefined;

  const configState = searchParams.get('configState');
  const verificationOptions =
    searchParams.get('verificationOptions') || 'only_code';
  const isHosted = searchParams.get('isHosted') !== 'false' ?? true;

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

        logger.debug(`configState: ${configState}`);
        if (typeof configState === 'string') {
          const minifiedText = await getMinifiedText(configState);
          const possiblyOptions = JSONParseOrNull(minifiedText.text);
          if (typeof possiblyOptions === 'object') {
            // Enforce the type of the custom one click options
            customOneClickOptions = mapOneClickOptions(
              possiblyOptions
            ) as Partial<OneClickOptions>;
          }
          logger.debug(`custom one click options found: ${minifiedText}`);
        }

        const options: Partial<OneClickOptions> = {
          phone,
          birthDate: formatterdBirthDate,
          redirectUrl,
          verificationOptions:
            verificationOptions as OneClickOptions['verificationOptions'],
          isHosted,
          ...customOneClickOptions,
        };

        console.log(JSON.stringify(options));

        const result = await oneClick(apiKey as string, options);

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
  const brandSet = await getBrandSet(searchParams);

  const oneClickUuid = searchParams.get('1ClickUuid');
  const configStateParam = searchParams.get('configState');

  let configState = null;

  if (configStateParam) {
    const state = await findStateByUuid(configStateParam);
    configState = JSONParseOrNull(state?.state);
  }

  if (oneClickUuid) {
    const result = await getSharedCredentialsOneClick(
      brandSet.apiKey,
      oneClickUuid
    );
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
