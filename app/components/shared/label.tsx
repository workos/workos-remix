import { Root } from '@radix-ui/react-label';
import classnames from 'classnames';
import type { FC, LabelHTMLAttributes } from 'react';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  className?: string;
}

export const Label: FC<Readonly<LabelProps>> = ({
  children,
  className,
  htmlFor,
  ...props
}) => (
  <Root
    {...props}
    className={classnames('block mb-1 text-sm text-gray-700', className)}
    htmlFor={htmlFor}
  >
    {children}
  </Root>
);
