import { ActionFunction, json } from '@remix-run/node';
import { PrismaClient } from '@prisma/client';

import { createState, findStateByUuid } from 'prisma/state';

import { getErrorMessage } from '~/errors';
import { logger } from '~/logger.server';

export const path = () => '/custom-demo-state';

export const get: ActionFunction = async ({ params, context }) => {
  try {
    if (!params.uuid) throw new Error('UUID is missing');

    const state = await findStateByUuid(
      context.prisma as PrismaClient,
      params.uuid
    );
    if (!state) {
      throw new Error('State not found');
    }

    return json({ data: state?.state });
  } catch (error) {
    logger.error(`Error getting custom demo state: ${getErrorMessage(error)}`);

    return json({ error: getErrorMessage(error) }, { status: 404 });
  }
};

export const action: ActionFunction = async ({ request, context }) => {
  try {
    const formData = await request.formData();
    const state = formData.get('state');
    const secondaryEnvBrand = formData.get('secondaryEnvBrand');
    const primaryEnvBrand = formData.get('primaryEnvBrand');

    if (
      !state ||
      typeof state !== 'string' ||
      !(state.startsWith('{') || state.endsWith('{'))
    ) {
      throw new Error('Bad payload');
    }

    if (typeof secondaryEnvBrand !== 'string') {
      throw new Error('secondaryEnvBrand is required');
    }

    if (typeof primaryEnvBrand !== 'string') {
      throw new Error('primaryEnvBrand is required');
    }

    const newState = await createState(context.prisma as PrismaClient, {
      state,
      secondaryEnvBrand,
      primaryEnvBrand,
    });

    return json({ data: newState });
  } catch (error) {
    logger.error(`Error saving custom demo state: ${getErrorMessage(error)}`);

    return json({ error: getErrorMessage(error) }, { status: 500 });
  }
};
