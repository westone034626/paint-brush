import { useState } from 'react';

export const useInput = (initialState?: string) => {
  const [value, setValue] = useState<string>(initialState ?? '');
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value: v },
    } = event;

    setValue(v);
  };
  return { value, onChange };
};
