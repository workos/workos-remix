import {
  Form,
  useActionData,
  useSubmit,
  useTransition,
} from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Button } from '../shared';
import { VerificationInput } from '../auth/verification-input';

export const TwoFactorForm = () => {
  const submit = useSubmit();
  const actionData = useActionData();
  const transition = useTransition();
  const [code, setCode] = useState('');

  const [activeForm, setActiveForm] = useState<'sms' | 'totp'>();

  const handleChange = (e) => {
    if (e.target.value.length === 6) {
      submit(e.currentTarget, { replace: true });
    }
  };

  const hasSmsEnabled = actionData?.smsFactorId;
  const hasTotpEnabled = actionData?.totpFactorId;
  const hasMfaEnabled = hasSmsEnabled || hasTotpEnabled;
  const hasAllFactorsEnabled = hasSmsEnabled && hasTotpEnabled;

  useEffect(() => {
    if (hasSmsEnabled) {
      setActiveForm('sms');
    }

    if (hasTotpEnabled) {
      setActiveForm('totp');
    }
  }, [hasTotpEnabled, hasSmsEnabled]);

  if (!hasMfaEnabled) {
    return null;
  }

  const isSubmittingVerificationCode =
    transition.state === 'submitting' &&
    transition.submission.formData.get('_action') === 'verify';

  console.log(actionData?.authenticationChallenge);
  return (
    <>
      <div>
        <h2 className="text-2xl  mb-5">Second Factor authentication</h2>
        <>
          {activeForm === 'totp' && (
            <Form method="post" onChange={handleChange}>
              <h3 className="text-xl mb-3 ">Authenticator app</h3>
              <p>
                Open the two-factor authenticator (TOTP) app on your mobile
                device to view your authentication code.{' '}
              </p>
              <div className="my-4">
                <VerificationInput code={code} setCode={setCode} />
              </div>
              <input
                type="hidden"
                name="authenticationChallengeId"
                value={actionData?.authenticationChallenge?.id}
              />
              <input type="hidden" name="userId" value={actionData?.userId} />
              <input type="hidden" name="_action" value="verify" />
              <input
                type="hidden"
                name="totpFactorId"
                value={actionData?.totpFactorId}
              />
              <input
                type="hidden"
                name="smsFactorId"
                value={actionData?.smsFactorId}
              />
              {actionData?.errors?.verificationCode && (
                <div className="my-4 text-red-700" id="password-error">
                  {actionData.errors.verificationCode}
                </div>
              )}
              <Button
                name="_action"
                value="verify"
                isLoading={isSubmittingVerificationCode}
                type="submit"
                isDisabled={code.length !== 6}
              >
                Verify
              </Button>
            </Form>
          )}
        </>
        <>
          {activeForm === 'sms' && (
            <div>
              <h3 className="text-xl mb-3">SMS verification code</h3>
              <p className="mb-3">
                {hasAllFactorsEnabled
                  ? `Send an SMS message to you registered phone number that ends with ${actionData?.phoneNumber}`
                  : `We've sent an SMS message to you registered phone number that ends with ${actionData?.phoneNumber}`}
              </p>{' '}
              <Form method="post">
                <input type="hidden" name="userId" value={actionData?.userId} />
                <input
                  type="hidden"
                  name="smsFactorId"
                  value={actionData?.smsFactorId}
                />
                <input
                  type="hidden"
                  name="phoneNumber"
                  value={actionData?.phoneNumber}
                />
                <input
                  type="hidden"
                  name="totpFactorId"
                  value={actionData?.totpFactorId}
                />

                {hasAllFactorsEnabled && (
                  <Button
                    name="_action"
                    value="sms"
                    type="submit"
                    isLoading={
                      transition.state === 'submitting' &&
                      transition.submission.formData.get('_action') === 'sms'
                    }
                  >
                    Send verification code
                  </Button>
                )}
                {actionData?.message && (
                  <div
                    className="my-4 text-sm text-green-700"
                    id="password-error"
                  >
                    {actionData?.message}
                  </div>
                )}
              </Form>
              <Form method="post" onChange={handleChange}>
                <div className="my-4">
                  <VerificationInput code={code} setCode={setCode} />
                </div>
                <input type="hidden" name="userId" value={actionData?.userId} />
                <input
                  type="hidden"
                  name="smsFactorId"
                  value={actionData?.smsFactorId}
                />
                <input
                  type="hidden"
                  name="totpFactorId"
                  value={actionData?.totpFactorId}
                />
                <input type="hidden" name="_action" value="verify" />
                <input
                  type="hidden"
                  name="authenticationChallengeId"
                  value={actionData?.authenticationChallenge?.id}
                />
                <input
                  type="hidden"
                  name="phoneNumber"
                  value={actionData?.phoneNumber}
                />
                {actionData?.errors?.verificationCode && (
                  <div className="my-4 text-red-700" id="password-error">
                    {actionData.errors.verificationCode}
                  </div>
                )}
                <Button
                  name="_action"
                  value="verify"
                  type="submit"
                  isLoading={isSubmittingVerificationCode}
                  isDisabled={code.length !== 6}
                >
                  Verify
                </Button>
              </Form>
            </div>
          )}
        </>
      </div>
      {hasAllFactorsEnabled && activeForm === 'totp' && (
        <button
          className="block text-gray-700  my-5 underline"
          onClick={() => setActiveForm('sms')}
        >
          Use SMS instead
        </button>
      )}
    </>
  );
};
