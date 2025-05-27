import React, { useEffect, useState } from 'react';
import Select from './Select';
import useCourtsQuery from '@/hooks/api/courts/useCourtsQuery';

interface Props {
  onChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
  error?: boolean;
  hint?: string;
  locationId?: number;
}

function SelectCourt({ onChange, defaultValue, locationId }: Props) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const courtsQuery = useCourtsQuery(locationId);

  useEffect(() => {
    if (courtsQuery.data) {
      const courtOptions = courtsQuery.data
        .filter(court => court.is_active)
        .map(court => ({
          value: court.id.toString(),
          label: court.name,
        }));
      setOptions(courtOptions);
    }
  }, [courtsQuery.data]);

  return (
    <Select
      options={options}
      onChange={(value) => onChange?.(value)}
      defaultValue={defaultValue}
      placeholder="Chọn sân"
    />
  );
}

export default SelectCourt;