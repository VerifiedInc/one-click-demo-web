import { ActionFunction, json } from '@remix-run/node';

import { getErrorMessage } from '~/errors';
import { logger } from '~/logger.server';
import { createState, findStateByUuid } from 'prisma/state';

export const path = () => '/custom-demo-state';

export const get: ActionFunction = async ({ params }) => {
  try {
    if (!params.uuid) throw new Error('UUID is missing');

    const state = await findStateByUuid(params.uuid);
    if (!state) {
      throw new Error('State not found');
    }

    return json({ data: state?.state });
  } catch (error) {
    logger.error(`Error getting custom demo state: ${getErrorMessage(error)}`);

    return json({ error: getErrorMessage(error) }, { status: 404 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const state = formData.get('state');
    const dummyBrand = formData.get('dummyBrand');
    const realBrand = formData.get('realBrand');

    if (
      !state ||
      typeof state !== 'string' ||
      !(state.startsWith('{') || state.endsWith('{'))
    ) {
      throw new Error('Bad payload');
    }

    if (typeof dummyBrand !== 'string') {
      throw new Error('dummyBrand is required');
    }

    if (typeof realBrand !== 'string') {
      throw new Error('realBrand is required');
    }

    const newState = await createState({ state, dummyBrand, realBrand });

    return json({ data: newState });
  } catch (error) {
    logger.error(`Error saving custom demo state: ${getErrorMessage(error)}`);

    return json({ error: getErrorMessage(error) }, { status: 500 });
  }
};
