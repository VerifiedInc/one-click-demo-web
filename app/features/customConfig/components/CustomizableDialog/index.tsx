import { useState } from 'react';
import { useRouteLoaderData, useSearchParams } from '@remix-run/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, SxProps } from '@mui/material';

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

  if (!defaultValues.redirectUrl) {
    defaultValues.redirectUrl = url.toString();
  }

  const form = useForm<CustomDemoForm>({
    resolver: zodResolver(customDemoFormSchema),
    defaultValues,
    mode: 'all',
  });
  const { isDirty } = form.formState;

  const handleFormSubmission = async (data: CustomDemoForm) => {
    searchParams.set(
      'verificationOptions',
      data.verificationOptions.toString()
    );
    searchParams.set('isHosted', data.isHosted.toString());
    searchParams.set('configOpen', 'false');

    const dummyBrand =
      searchParams.get('dummyBrand') || routerData?.configState?.dummyBrand;
    const realBrand =
      searchParams.get('realBrand') || routerData?.configState?.realBrand;
    const formData = new FormData();
    formData.set('state', JSON.stringify(data));
    dummyBrand && formData.set('dummyBrand', dummyBrand);
    realBrand && formData.set('realBrand', realBrand);

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
    </Dialog>
  );
}
