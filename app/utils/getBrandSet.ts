import { BrandDto } from '@verifiedinc/core-types';
import { PrismaClient } from '@prisma/client';

import { config } from '~/config';
import { getBrandApiKey, getBrandDto } from '~/coreAPI.server';

import { getBrand } from './getBrand';
import { logger } from '~/logger.server';

import { findState } from '~/features/state/services/findState';
import { getAdminKey, getBaseUrl, ifEnv } from '~/features/environment/helpers';

export const getBrandSet = async (
  prisma: PrismaClient,
  searchParams: URLSearchParams
) => {
  let brand = getBrand(null);
  let apiKey = config.verifiedApiKey;

  // Allow custom branding under environment flag.
  if (config.customBrandingEnabled) {
    const state = await findState(prisma, searchParams.get('configState'));
    const brandParam = searchParams.get('brand');
    const dummyBrandParam = searchParams.get('dummyBrand') || state?.dummyBrand;
    const realBrandParam = searchParams.get('realBrand') || state?.realBrand;
    const hasEnvBrands = !!state?.dummyBrand && !!state?.realBrand;
    const environment = hasEnvBrands
      ? state?.state.environment
      : brandParam
      ? undefined
      : 'dummy';

    const brandUuid = ifEnv(environment, [
      realBrandParam,
      dummyBrandParam,
      brandParam,
    ]);

    // Override possibly brand in session if query param is set.
    if (brandUuid) {
      logger.info(`getting brand: ${brandUuid}`);

      const baseUrl = getBaseUrl(environment);
      const adminKey = getAdminKey(environment);

      apiKey = await getBrandApiKey(brandUuid, {
        baseUrl,
        adminKey,
      });

      logger.info(`got api key: ${apiKey}`);

      const brandDto = await getBrandDto(brandUuid, {
        baseUrl,
        adminKey,
      });

      brand = getBrand(brandUuid ? (brandDto as BrandDto) : null);

      logger.info(`got brand: ${JSON.stringify(brandParam)}`);
    }
  }

  return {
    apiKey,
    brand,
  };
};
