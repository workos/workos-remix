import { CheckIcon } from '@radix-ui/react-icons';
import {
  Form,
  useActionData,
  useSubmit,
  useTransition,
} from '@remix-run/react';
import { Button } from '~/components/shared';
import { VerificationInput, TotpSecretDialog } from '~/components/auth';
import { useState } from 'react';

export const Verify = () => {
  const actionData = useActionData();
  const transition = useTransition();
  const submit = useSubmit();
  const [code, setCode] = useState('');

  // TODO: Add types
  const handleChange = (e) => {
    if (e.target.value.length === 6) {
      submit(e.currentTarget, { replace: true });
    }
  };

  return (
    <div>
      <li
        className={`ml-6 my-5 ${
          actionData?.step === 1
            ? 'p-5 border-2 border-gray-200 rounded-md'
            : ''
        }`}
      >
        {actionData?.step === 1 ? (
          <>
            {actionData?.authenticationFactor?.type === 'totp' && (
              <>
                <div className="text-lg  flex items-center mb-3">
                  <span className="flex absolute -left-4 justify-center items-center w-5 p-3.5 h-5 bg-indigo-500  rounded-full ring-8 ring-white text-base  text-white">
                    2
                  </span>
                  <h2> Authentication verification</h2>
                </div>
                <p>
                  Scan the image below with the Multi-factor authentication app
                  on your phone. If you can't use a QR code, you can enter this
                  text code instead
                </p>
                <div className="rounded-lg shadow-lg bg-white my-5 w-52 h-52 p-5">
                  <img
                    src={actionData?.authenticationFactor?.totp.qr_code}
                    alt="QR code"
                    className="w-52"
                  />
                </div>
                <p>
                  After scanning the QR code image, the app will display a code
                  that you can enter below.If you can't use scan the QR code,use{' '}
                  <TotpSecretDialog
                    message={`${actionData?.authenticationFactor?.totp.secret}`}
                  />{' '}
                  instead
                </p>
                <Form method="post" onChange={handleChange}>
                  <div className="my-4">
                    <VerificationInput code={code} setCode={setCode} />
                  </div>
                  {actionData?.errors?.verificationCode && (
                    <div className="my-4 text-red-700" id="password-error">
                      {actionData.errors.verificationCode}
                    </div>
                  )}
                  <input
                    type="hidden"
                    name="authenticationChallengeId"
                    value={actionData?.authenticationChallenge.id}
                  />
                  <input
                    type="hidden"
                    name="authenticationFactorType"
                    value="totp"
                  />
                  <input
                    type="hidden"
                    name="qr_code"
                    value={actionData?.authenticationFactor?.totp.qr_code}
                  />
                  <input
                    type="hidden"
                    name="secret"
                    value={actionData?.authenticationFactor?.totp.secret}
                  />
                  <input type="hidden" name="_action" value="verify" />
                  <Button
                    type="submit"
                    name="_action"
                    value="verify"
                    isLoading={
                      transition.state === 'submitting' &&
                      transition.submission.formData.get('_action') === 'verify'
                    }
                  >
                    Verify
                  </Button>
                </Form>
              </>
            )}
            {actionData?.setupSms && (
              <div className="space-y-3">
                <div className="text-lg  flex items-center mb-3">
                  <span className="flex absolute -left-4 justify-center items-center w-5 p-3.5 h-5 bg-indigo-500  rounded-full ring-8 ring-white text-base  text-white">
                    2
                  </span>
                  <h2> Authentication verification</h2>
                </div>
                <p>
                  We will send authentication codes to your mobile phone during
                  sign in.
                </p>

                <Form method="post">
                  <fieldset className="space-y-1 mb-3">
                    <label
                      htmlFor="phoneNumber"
                      className="text-sm  text-gray-700"
                    >
                      Phone number
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      name="phoneNumber"
                      placeholder="(+20)1005321184"
                      className="focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 border border-gray-400 focus-visible:border-transparent mt-1 block max-w-sm rounded-md text-sm text-gray-700 placeholder:text-gray-500 p-1"
                    />
                    {actionData?.errors?.message && (
                      <div className="text-sm text-red-700" id="password-error">
                        {actionData.errors.message}
                      </div>
                    )}
                  </fieldset>
                  <Button
                    name="_action"
                    value="phoneNumber"
                    type="submit"
                    isLoading={
                      transition.state === 'submitting' &&
                      transition.submission.formData.get('_action') ===
                        'phoneNumber'
                    }
                  >
                    Send authentication code
                  </Button>
                </Form>

                {actionData?.authenticationChallenge && actionData?.setupSms && (
                  <Form method="post" onChange={handleChange}>
                    <div className="my-4">
                      <VerificationInput code={code} setCode={setCode} />
                    </div>
                    {actionData?.errors?.verificationCode && (
                      <div className="my-4 text-red-700" id="password-error">
                        {actionData.errors.verificationCode}
                      </div>
                    )}
                    <input
                      type="hidden"
                      name="authenticationChallengeId"
                      value={actionData?.authenticationChallenge?.id}
                    />
                    <input
                      type="hidden"
                      name="authenticationFactorType"
                      value="sms"
                    />
                    <input type="hidden" name="_action" value="verify" />
                    <Button
                      name="_action"
                      value="verify"
                      type="submit"
                      isDisabled={code.length !== 6}
                      isLoading={
                        transition.state === 'submitting' &&
                        transition.submission.formData.get('_action') ===
                          'verify'
                      }
                    >
                      Verify
                    </Button>
                  </Form>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-lg  flex items-center mb-3">
            {actionData?.step > 1 ? (
              <span className="flex absolute bg-indigo-500 -left-4 justify-center items-center w-7 h-7 rounded-full">
                <CheckIcon className="w-4 h-4 text-white" />
              </span>
            ) : (
              <span className="flex absolute  -left-4 justify-center items-center w-5 p-3.5 h-5 bg-indigo-500  rounded-full ring-8 ring-white text-base  text-white">
                2
              </span>
            )}
            <h2>Authentication verification</h2>
          </div>
        )}
      </li>
    </div>
  );
};
