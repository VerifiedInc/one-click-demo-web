import { useEffect, useState } from 'react';
import { useRouteLoaderData, useSearchParams } from '@remix-run/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, SxProps } from '@mui/material';
import { MinifiedText } from '@verifiedinc/core-types';

import { useDebounce } from '~/hooks/useDebounce';

import { path } from '~/routes/custom-demo-state';

import { EnvironmentStep } from '~/features/customConfig/components/CustomizableDialog/components/EnvironmentStep';
import {
  CustomDemoForm,
  customDemoFormSchema,
} from '~/features/customConfig/validators/form';
import { mapFormState } from '~/features/customConfig/mappers/mapFormState';
import { CustomizeStep } from '~/features/customConfig/components/CustomizableDialog/components/CustomizeStep';
import { CustomConfigProvider } from '~/features/customConfig/contexts/CustomConfig';

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
  const data = useRouteLoaderData('routes/register');

  const [dialogOpen, setDialogOpen] = useState(true);
  const [showDetailStep, setShowDetailStep] = useState(false);
  const [optionsState, setOptions] = useState<string | null>(null);
  const options = useDebounce(optionsState, 500);

  const form = useForm<CustomDemoForm>({
    resolver: zodResolver(customDemoFormSchema),
    defaultValues: mapFormState(data?.configState || {}),
    mode: 'all',
  });
  const isValid = form.formState.isValid;
  const isDirty = form.formState.isDirty;

  // Effect that watches the form state and updates the options state
  useEffect(() => {
    const subscription = form.watch((data) => {
      setOptions(JSON.stringify(data));
    });

    return subscription.unsubscribe;
  }, [form, isValid]);

  // Effect that updates remote state when options change
  useEffect(() => {
    const controller = new AbortController();

    const handleUpdateStatus = async () => {
      if (!options || !isValid || !isDirty) return;

      const formData = new FormData();
      options && formData.set('state', options);

      const response = await fetch(path(), {
        signal: controller.signal,
        method: 'POST',
        body: formData,
      });
      const { data: minifiedText }: { data: MinifiedText } =
        await response.json();

      console.log('custom demo state saved', minifiedText);

      // Update url with the current state
      searchParams.set('configState', minifiedText.uuid);
      setSearchParams(searchParams);
    };

    handleUpdateStatus();

    return () =>
      controller.abort(
        'cancelled by react strict effect cleanup, just ignore it'
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <Dialog open={dialogOpen} sx={dialogStyle}>
      <CustomConfigProvider>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(() => setDialogOpen(false))}>
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
