import { BrandDto } from '@verifiedinc/core-types';

import { config } from '~/config';
import { getBrandDto, getBrandFromEmail } from '~/coreAPI.server';

import { getBrand } from './getBrand';
import { logger } from '~/logger.server';

export const getBrandSet = async (searchParams: URLSearchParams) => {
  let brand = getBrand(null);
  let apiKey: string | null = config.verifiedApiKey;

  // Allow custom branding under environment flag.
  if (config.customBrandingEnabled) {
    const email = searchParams.get('email');

    // Override possibly brand in session if query param is set.
    if (email) {
      logger.info(`getting brand from email: ${email}`);

      const brandFromEmail = await getBrandFromEmail(email);

      if (brandFromEmail) {
        const oneClickDemoUrl = new URL(brandFromEmail?.['1ClickDemoUrl']);
        const brandUuid = oneClickDemoUrl.searchParams.get('brand');

        apiKey = brandFromEmail.apiKey;

        logger.info(`got api key: ${apiKey}`);

        brand = getBrand(
          brandUuid
            ? ((await getBrandDto(
                brandUuid,
                config.coreServiceAdminAuthKey
              )) as BrandDto)
            : null
        );

        logger.info(`got brand: ${JSON.stringify(brand)}`);
      }
    }
  }

  return {
    apiKey,
    brand,
  };
};
