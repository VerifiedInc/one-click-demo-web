import { useState } from 'react';
import { useRouteLoaderData, useSearchParams } from '@remix-run/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, SxProps, ThemeProvider } from '@mui/material';

import { theme } from '~/styles/verified-theme';

import { path } from '~/routes/custom-demo-state';

import { EnvironmentStep } from '~/features/customConfig/components/CustomizableDialog/components/EnvironmentStep';
import {
  CustomDemoForm,
  customDemoFormSchema,
} from '~/features/customConfig/validators/form';
import { defaultCredentialRequests } from '~/features/customConfig/components/CustomizableDialog/utils/defaultValues';
import { mapFormState } from '~/features/customConfig/mappers/mapFormState';
import { CustomizeStep } from '~/features/customConfig/components/CustomizableDialog/components/CustomizeStep';
import { CustomConfigProvider } from '~/features/customConfig/contexts/CustomConfig';
import { MappedState } from '~/features/state/types';

const dialogStyle: SxProps = {
  '& .MuiPaper-root': {
    maxWidth: '391px',
    width: '100%',
    borderRadius: '6px!important',
    pt: 4,
    pb: 2.5,
  },
  '& .MuiTypography-root': {
    fontFamily: 'Lato !important',
    textAlign: 'center',
  },
  '& .MuiTypography-h1': {
    fontSize: '34px',
    fontWeight: '800!important',
  },
  '& .MuiTypography-h2': {
    fontWeight: '800!important',
  },
};

export function CustomizableDialog() {
  const [searchParams, setSearchParams] = useSearchParams();
  // Get data from loader to consume configState from it
  const routerData = useRouteLoaderData<{ configState: MappedState | null }>(
    'routes/register'
  );

  const [dialogOpen, setDialogOpen] = useState(true);
  const [showDetailStep, setShowDetailStep] = useState(false);

  const url =
    typeof window !== 'undefined' ? new URL(window.location.href) : '';
  const defaultValues = mapFormState(
    routerData?.configState?.state || {
      credentialRequests: defaultCredentialRequests,
    }
  );

  if (!defaultValues.redirectUrl && url) {
    defaultValues.redirectUrl = `${url.origin}/register`;
  }

  const form = useForm<CustomDemoForm>({
    resolver: zodResolver(customDemoFormSchema),
    defaultValues,
    mode: 'all',
  });
  const { isDirty } = form.formState;

  const handleFormSubmission = async (data: CustomDemoForm) => {
    const currentUrl = new URL(window.location.href);

    // Redirect to personal-information if is non-hosted flow and no redirectUrl is provided
    if (data.redirectUrl) {
      const redirectUrl = new URL(data.redirectUrl);
      if (currentUrl.pathname === redirectUrl.pathname && !data.isHosted) {
        data.redirectUrl = `${redirectUrl.origin}/personal-information`;
      }
    } else {
      if (!data.isHosted) {
        data.redirectUrl = `${currentUrl.origin}/personal-information`;
      }
    }

    // If the default types are changed, redirect to the verified page
    const untouchedDefaultTypes = [
      'FullNameCredential',
      'EmailCredential',
      'PhoneCredential',
      'AddressCredential',
      'BirthDateCredential',
      'SsnCredential',
    ].every((type) => {
      return data.credentialRequests.some((request) => request.type === type);
    });
    if (!untouchedDefaultTypes && !data.isHosted) {
      data.redirectUrl = `${currentUrl.origin}/verified`;
    }

    searchParams.set(
      'verificationOptions',
      data.verificationOptions.toString()
    );
    searchParams.set('isHosted', data.isHosted.toString());
    searchParams.set('configOpen', 'false');

    const secondaryEnvBrand =
      searchParams.get('secondaryEnvBrand') ||
      routerData?.configState?.secondaryEnvBrand;
    const primaryEnvBrand =
      searchParams.get('primaryEnvBrand') ||
      routerData?.configState?.primaryEnvBrand;
    const formData = new FormData();
    formData.set('state', JSON.stringify(data));
    secondaryEnvBrand && formData.set('secondaryEnvBrand', secondaryEnvBrand);
    primaryEnvBrand && formData.set('primaryEnvBrand', primaryEnvBrand);

    if (isDirty) {
      const response = await fetch(path(), {
        method: 'POST',
        body: formData,
      });
      const { data: state } = await response.json();

      console.log('custom demo state saved', state);

      // Update url with the current state
      searchParams.set('configState', state.uuid);
    }

    setSearchParams(searchParams);
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} sx={dialogStyle}>
      <ThemeProvider theme={theme}>
        <CustomConfigProvider>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmission)}>
              {!showDetailStep && (
                <EnvironmentStep
                  onCustomizePress={() => setShowDetailStep(true)}
                />
              )}
              {showDetailStep && (
                <CustomizeStep onBackPress={() => setShowDetailStep(false)} />
              )}
            </form>
          </FormProvider>
        </CustomConfigProvider>
      </ThemeProvider>
    </Dialog>
  );
}
