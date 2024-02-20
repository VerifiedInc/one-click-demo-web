import { logger } from '~/logger.server';
import { getDBOneClick, getSharedCredentialsOneClick } from '~/coreAPI.server';
import { getBrandSet } from '~/utils/getBrandSet';

export async function getOneClickUseCase({ request }: { request: Request }) {
  const url = new URL(request.url);
  const { searchParams } = url;
  const brandSet = await getBrandSet(searchParams);

  const oneClickUuid = searchParams.get('1ClickUuid');

  if (oneClickUuid) {
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
