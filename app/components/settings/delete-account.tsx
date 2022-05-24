import { Button } from '../shared';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import classnames from 'classnames';
import { Form } from '@remix-run/react';

export const DeleteAccount = () => {
  return (
    <div>
      <h3 className="text-xl leading-6 text-gray-900 ">Danger Zone</h3>
      <div className="flex w-full flex-col space-y-4 md:flex-row justify-between my-4 md:items-center">
        <div>
          <h4 className="mb-1">Delete your account</h4>
          <p className="text-sm max-w-sm text-gray-600">
            Once you delete your account, there is no going back. All of your
            data will be lost. Please be certain.
          </p>
        </div>
        <Form method="post">
          <AlertDialogPrimitive.Root>
            <AlertDialogPrimitive.Trigger asChild>
              <Button
                className="flex-shrink-0 max-w-[9rem]"
                size="large"
                appearance="danger"
              >
                Delete account
              </Button>
            </AlertDialogPrimitive.Trigger>

            <AlertDialogPrimitive.Overlay className="fixed inset-0 z-20 bg-black/50" />
            <AlertDialogPrimitive.Content
              className={classnames(
                'fixed z-50',
                'w-[95vw] max-w-md rounded-lg p-4 md:w-full',
                'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
                'bg-white',
                'focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75'
              )}
            >
              <AlertDialogPrimitive.Title className="text-sm font-medium text-gray-900 ">
                Are you absolutely sure?
              </AlertDialogPrimitive.Title>
              <AlertDialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogPrimitive.Description>
              <div className="mt-4 flex justify-end space-x-2">
                <AlertDialogPrimitive.Cancel asChild>
                  <Button appearance="muted">Cancel</Button>
                </AlertDialogPrimitive.Cancel>
                <Button
                  type="submit"
                  name="_action"
                  value="deleteAccount"
                  appearance="danger"
                >
                  Confirm
                </Button>
              </div>
            </AlertDialogPrimitive.Content>
          </AlertDialogPrimitive.Root>
        </Form>
      </div>
    </div>
  );
};
