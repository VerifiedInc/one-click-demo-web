import { ActionFunction, json } from '@remix-run/node';

import { getErrorMessage } from '~/errors';
import { logger } from '~/logger.server';
import { createMinifiedText, getMinifiedText } from '~/coreAPI.server';

export const path = () => '/custom-demo-state';

export const get: ActionFunction = async ({ params }) => {
  try {
    if (!params.uuid) throw new Error('UUID is missing');

    const minifiedText = await getMinifiedText(params.uuid);

    return json({ data: minifiedText });
  } catch (error) {
    logger.error(`Error getting custom demo state: ${getErrorMessage(error)}`);

    return json({ error: getErrorMessage(error) }, { status: 404 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const state = formData.get('state');

    if (
      !state ||
      typeof state !== 'string' ||
      !(state.startsWith('{') || state.endsWith('{'))
    ) {
      throw new Error('Bad payload');
    }

    const minifiedText = await createMinifiedText(state);

    return json({ data: minifiedText });
  } catch (error) {
    logger.error(`Error saving custom demo state: ${getErrorMessage(error)}`);

    return json({ error: getErrorMessage(error) }, { status: 500 });
  }
};
