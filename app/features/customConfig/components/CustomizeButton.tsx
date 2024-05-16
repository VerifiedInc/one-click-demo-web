import { useSearchParams } from '@remix-run/react';
import { Tune } from '@mui/icons-material';

import { OriginalButton } from '~/components/OriginalButton';

export function CustomizeButton() {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <OriginalButton
      onClick={() => {
        searchParams.delete('configOpen');
        setSearchParams(searchParams);
      }}
      variant='text'
      sx={{ fontSize: '13px ', mt: 1.25 }}
      startIcon={<Tune />}
    >
      Customize Demo
    </OriginalButton>
  );
}
