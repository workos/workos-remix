import * as DialogPrimitive from '@radix-ui/react-dialog';

interface DialogProps {
  message: string;
}
export const TotpSecretDialog = ({ message }: DialogProps) => {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger className="text-indigo-600">
        this secret
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Overlay className="fixed inset-0 z-20 bg-black/50" />
      <DialogPrimitive.Content
        className={
          'fixed z-50 w-[95vw] max-w-md rounded-lg p-4 md:w-full top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-white '
        }
      >
        <DialogPrimitive.Title className="text-sm font-medium text-gray-900 border-b-2 border-gray-200">
          Your two-factor secret
        </DialogPrimitive.Title>
        <DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700">
          {message}
        </DialogPrimitive.Description>
      </DialogPrimitive.Content>
    </DialogPrimitive.Root>
  );
};
