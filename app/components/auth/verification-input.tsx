import Input from 'react-verification-input';
import type { Dispatch, SetStateAction } from 'react';

interface VerificationInputProps {
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
}

export const VerificationInput = ({
  code,
  setCode,
}: VerificationInputProps) => {
  const handleChange = (e: { target: { value: any } }) => {
    setCode(e.target.value);
  };

  return (
    <div className="max-w-xs">
      <label
        htmlFor="authenticationCode"
        className="block text-sm  text-gray-700 mb-2"
      >
        Verification code
      </label>
      <Input
        autoFocus
        value={code}
        placeholder=" "
        removeDefaultStyles
        classNames={{
          container: 'container',
          character: 'character',
          characterInactive: 'character--inactive',
          characterSelected: 'character--selected',
        }}
        inputProps={{
          onChange: (value: { target: { value: any } }) => handleChange(value),
          name: 'authenticationCode',
        }}
      />
    </div>
  );
};
