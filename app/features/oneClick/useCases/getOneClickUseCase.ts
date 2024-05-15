import type { AppLoadContext } from '@remix-run/node';
import { PrismaClient } from '@prisma/client';

import { logger } from '~/logger.server';
import { getDBOneClick, getSharedCredentialsOneClick } from '~/coreAPI.server';
import { getBrandSet } from '~/utils/getBrandSet';
import { MappedState } from '~/features/state/types';
import { findState } from '~/features/state/services/findState';
import { getBaseUrl } from '~/features/environment/helpers';

export async function getOneClickUseCase({
  context,
  request,
}: {
  context: AppLoadContext;
  request: Request;
}) {
  const url = new URL(request.url);
  const { searchParams } = url;
  const brandSet = await getBrandSet(
    context.prisma as PrismaClient,
    searchParams
  );

  const oneClickUuid = searchParams.get('1ClickUuid');
  const optedOut = url.searchParams.get('optedOut');
  const configStateParam = searchParams.get('configState');
  let configState: MappedState | null = null;

  if (configStateParam) {
    configState = await findState(
      context.prisma as PrismaClient,
      configStateParam
    );
  }

  logger.info(`optedOut value ${optedOut}`);

  // if the oneClickUuid is present and the user has not opted out
  if (oneClickUuid && optedOut !== 'true' && configState) {
    logger.info('1click uuid value found and opted out is not true');
    const oneClick = await getSharedCredentialsOneClick(oneClickUuid, {
      baseUrl: getBaseUrl(configState.state.environment),
      apiKey: brandSet.apiKey,
    });
    const oneClickDB = await getDBOneClick(oneClickUuid);

    if (oneClick && oneClickDB) {
      return { success: { oneClick, oneClickDB } };
    }

    logger.error('OneClick not found', { oneClickUuid });

    return { failure: new Error('OneClick not found') };
  }
}
