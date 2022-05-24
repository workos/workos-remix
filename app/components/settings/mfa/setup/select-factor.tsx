import * as RadioGroup from '@radix-ui/react-radio-group';
import { Form, useActionData, useTransition } from '@remix-run/react';
import { ChatBubbleIcon, CheckIcon, MobileIcon } from '@radix-ui/react-icons';
import { Button } from '~/components/shared';

export const SelectFactor = () => {
  const actionData = useActionData();
  const transition = useTransition();

  return (
    <div>
      <li
        className={` ml-6 ${
          !actionData?.step ? 'p-5 border-2 border-gray-200 rounded-md' : ''
        }`}
      >
        {actionData?.step >= 1 ? (
          <div className="text-lg  flex items-center">
            <span className="flex absolute bg-indigo-500 -left-4 justify-center items-center w-7 h-7 rounded-full">
              <CheckIcon className="w-4 h-4 text-white" />
            </span>
            <h2>Choose an authentication factor</h2>
          </div>
        ) : (
          <>
            <div className="text-lg  flex items-center">
              <span className="flex absolute top-0 -left-4 justify-center items-center w-5 p-3.5 h-5 bg-indigo-500  rounded-full ring-8 ring-white text-base  text-white">
                1
              </span>
              <h2>Choose an authentication factor</h2>
            </div>
            <p className="mb-5 mt-3">
              Two-factor authentication (2FA) is an extra layer of security used
              when logging into websites or apps.
            </p>
            <Form method="post" className="mt-3 space-y-3 mb-4">
              <RadioGroup.Root
                name="authenticationFactorType"
                aria-label="Select authentication factor type"
              >
                <div className="flex space-x-3 items-start mb-5">
                  <div>
                    <RadioGroup.Item
                      className="block h-4 w-4 mt-2.5 bg-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 checked:bg-red-500"
                      value="totp"
                      id="totp"
                    >
                      <RadioGroup.Indicator className="relative flex items-center justify-center">
                        <div className="bg-indigo-600 w-2 h-2 rounded-full"></div>
                      </RadioGroup.Indicator>
                    </RadioGroup.Item>
                  </div>
                  <label htmlFor="totp">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="bg-indigo-500 rounded-full p-2">
                        <MobileIcon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-lg">Set up using an app</p>
                    </div>
                    <p>
                      Use an application on your phone to get an authentication
                      code when prompted. We recommend using cloud-based TOTP
                      apps such as:{' '}
                      <a
                        className="text-indigo-600 hover:underline"
                        href="https://1passwword.com"
                      >
                        1Password
                      </a>{' '}
                      ,{' '}
                      <a
                        className="text-indigo-600 hover:underline"
                        href="https://authy.com/"
                      >
                        Authy
                      </a>
                      ,{' '}
                      <a
                        className="text-indigo-600 hover:underline"
                        href="https://www.lastpass.com/"
                      >
                        LastPass
                      </a>
                      , or{' '}
                      <a
                        className="text-indigo-600 hover:underline"
                        href="https://www.microsoft.com/en-us/security/mobile-authenticator-app"
                      >
                        Microsoft Authenticator.
                      </a>
                    </p>
                  </label>
                </div>
                <div className="flex space-x-3 items-start">
                  <RadioGroup.Item
                    className="h-4 w-4 mt-2.5 bg-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 checked:bg-red-500"
                    value="sms"
                    id="sms"
                  >
                    <RadioGroup.Indicator className="relative flex items-center justify-center ">
                      <div className="bg-indigo-600 w-2 h-2 rounded-full"></div>
                    </RadioGroup.Indicator>
                  </RadioGroup.Item>
                  <label htmlFor="sms">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="bg-indigo-500 rounded-full p-2">
                        <ChatBubbleIcon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-lg">Set up using SMS</p>
                    </div>
                    <p>
                      We will send you an SMS with an authentication code when
                      prompted.
                    </p>
                  </label>
                </div>
              </RadioGroup.Root>
              <p className="text-red-500">{actionData?.errors?.message}</p>
              <Button
                isLoading={
                  transition.state === 'submitting' &&
                  transition.submission.formData.get('_action') ===
                    'selectFactor'
                }
                name="_action"
                value="selectFactor"
                type="submit"
              >
                Continue
              </Button>
            </Form>
          </>
        )}
      </li>
    </div>
  );
};
