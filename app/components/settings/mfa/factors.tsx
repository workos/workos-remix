import { Form, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/shared/button';

type LoaderData = {
  totpFactorId?: string;
  smsFactorId?: string;
};

export const Factors = () => {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl leading-6 text-gray-900 ">
            Two-factor authentication
          </h3>
          <Form method="post">
            <Button size="small" name="_action" value="toggle2FA">
              {data?.totpFactorId || data?.smsFactorId ? 'Disable' : 'Enable'}
            </Button>
          </Form>
        </div>
        <p className="mb-3 text-sm max-w-md text-gray-600">
          Two-factor authentication (2FA) is an extra layer of security used
          when logging into websites or apps.
        </p>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Two-factor methods
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="items-center py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm  text-gray-500">Authenticator app</dt>
                <dd className="mt-1 text-right text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Form
                    method="get"
                    action="/settings/two-factor-authentication"
                  >
                    <span className="mr-5 text-gray-500">
                      {data?.totpFactorId ? 'Configured' : 'Not configured'}
                    </span>
                    <Button type="submit">
                      {data?.totpFactorId ? 'Edit' : 'Add'}
                    </Button>
                  </Form>
                </dd>
              </div>
              <div className="py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm   text-gray-500">SMS</dt>
                <dd className="mt-1 text-right text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Form
                    method="get"
                    action="/settings/two-factor-authentication"
                  >
                    <span className="mr-5 text-gray-500">
                      {data?.smsFactorId ? 'Configured' : 'Not configured'}
                    </span>
                    <Button type="submit">
                      {data?.smsFactorId ? 'Edit' : 'Add'}
                    </Button>
                  </Form>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
