import type { AppLoadContext } from '@remix-run/node';
import { PrismaClient } from '@prisma/client';

import { logger } from '~/logger.server';
import { getDBOneClick, getSharedCredentialsOneClick } from '~/coreAPI.server';
import { getBrandSet } from '~/utils/getBrandSet';

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

  // if the oneClickUuid is present and the user has not opted out
  if (oneClickUuid && optedOut !== 'true') {
    const oneClick = await getSharedCredentialsOneClick(
      brandSet.apiKey,
      oneClickUuid
    );
    const oneClickDB = await getDBOneClick(oneClickUuid);

    if (oneClick && oneClickDB) {
      return { success: { oneClick, oneClickDB } };
    }

    logger.error('OneClick not found', { oneClickUuid });

    return { failure: new Error('OneClick not found') };
  }
}
