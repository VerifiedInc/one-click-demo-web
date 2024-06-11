import { useLoaderData } from '@remix-run/react';

import { RequestDataLoader } from '~/features/request/request/types';
import { RequestBody } from '~/features/request/request/RequestBody';

export function Request() {
  const { presentationRequest, credentials, schema } =
    useLoaderData<RequestDataLoader>();

  return (
    <RequestBody
      presentationRequest={presentationRequest}
      credentials={credentials || []}
      schema={schema}
    />
  );
}
