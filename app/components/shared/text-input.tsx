import type { InputHTMLAttributes } from 'react';
import classnames from 'classnames';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'email' | 'password' | 'hidden' | 'number';
  className?: string;
  id: string;
  name: string;
  placeholder?: string;
  value?: string;
  autoComplete?: string;
}

export const TextInput = ({
  type = 'text',
  id,
  name,
  className,
  placeholder,
  value,
  autoComplete = 'on',
  ...props
}: TextInputProps) => {
  // TODO: form validation
  return (
    <input
      autoComplete={autoComplete}
      className={classnames(
        className,
        'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
      )}
      placeholder={placeholder}
      id={id}
      name={name}
      type={type}
      value={value}
      {...props}
    />
  );
};
