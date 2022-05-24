import { json } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import {
  enrollAuthenticationFactor,
  updatePhoneNumber,
} from '~/models/user.server';
import { requireUser, requireUserId } from '~/utils/session.server';
import { workos } from '~/lib/workos.server';
import {
  SelectFactor,
  Verify,
  Activated,
} from '~/components/settings/mfa/setup';

export const loader: LoaderFunction = async ({ request }) => {
  return await requireUserId(request);
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  let formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

  const { authenticationFactorType } = values;

  switch (_action) {
    case 'selectFactor':
      if (!authenticationFactorType) {
        return json(
          {
            errors: {
              message: 'You must select an authentication factor to proceed',
            },
          },
          { status: 400 },
        );
      }
      if (authenticationFactorType === 'totp') {
        try {
          // change issuer field to your app name
          const authenticationFactor = await workos.mfa.enrollFactor({
            type: 'totp',
            issuer: 'Remix with WorkOS',
            user: user.email,
          });

          const authenticationChallenge = await workos.mfa.challengeFactor({
            authenticationFactorId: authenticationFactor.id,
          });

          return { authenticationFactor, authenticationChallenge, step: 1 };
        } catch (error) {
          return json({ errors: { message: error } }, { status: 400 });
        }
      }

      return { setupSms: true, step: 1 };

    case 'phoneNumber':
      const { phoneNumber } = values;

      if (!phoneNumber) {
        return json(
          {
            setupSms: true,
            step: 1,
            errors: { message: 'You need to provide a phone number' },
          },
          { status: 400 },
        );
      }

      try {
        const authenticationFactor = await workos.mfa.enrollFactor({
          type: 'sms',
          phoneNumber: phoneNumber as string,
        });

        const authenticationChallenge = await workos.mfa.challengeFactor({
          authenticationFactorId: authenticationFactor.id,
        });

        await updatePhoneNumber(user.id, phoneNumber as string);

        return {
          setupSms: true,
          authenticationFactor,
          authenticationChallenge,
          step: 1,
        };
      } catch (error) {
        if (error.code === 'invalid_phone_number') {
          return json(
            {
              setupSms: true,
              authenticationFactorType: 'sms',
              step: 1,
              errors: {
                message: 'Invalid phone number',
              },
            },
            { status: 401 },
          );
        }
        console.log(error);
      }

    case 'verify':
      const { authenticationCode, authenticationChallengeId, qr_code } = values;

      try {
        const response = await workos.mfa.verifyFactor({
          authenticationChallengeId: authenticationChallengeId as string,
          code: authenticationCode as string,
        });

        if (!response.valid) {
          return {
            errors: {
              verificationCode: 'Invalid verification code, please try again',
            },
            authenticationFactor: {
              type: authenticationFactorType,
              totp: {
                qr_code,
              },
            },
            setupSms: authenticationFactorType === 'sms',
            authenticationChallenge: {
              id: authenticationChallengeId,
            },
            step: 1,
          };
        }

        await enrollAuthenticationFactor(user.id, {
          smsFactorId:
            authenticationFactorType === 'sms'
              ? response.challenge.authentication_factor_id
              : undefined,
          totpFactorId:
            authenticationFactorType === 'totp'
              ? response.challenge.authentication_factor_id
              : undefined,
        });

        return { step: 2 };
      } catch (error) {
        switch (error.code) {
          case 'authentication_challenge_expired':
            return json(
              {
                errors: {
                  message:
                    'The two factor authentication time-window has expired',
                },
              },
              { status: 400 },
            );

          case 'authentication_challenge_previously_verified':
            console.log('Challenge already verified');

          default:
            console.log(error);
            return json({ errors: { message: error } }, { status: 400 });
        }
      }
  }
  return null;
};

const MultiFactorAuthentication = () => {
  return (
    <section className="my-10">
      <h1 className="text-2xl font">Set up two-factor authentication (2FA)</h1>
      <ol className="my-8 relative border-l-2 border-gray-200">
        <SelectFactor />
        <Verify />
        <Activated />
      </ol>
    </section>
  );
};

export default MultiFactorAuthentication;
