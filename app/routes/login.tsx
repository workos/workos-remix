/*
For this route, there are four possibilities:
- The user doesn't have 2FA enabled
- The user has 2FA enabled and is using TOTP only
- The user has 2FA enabled and using SMS verification only
- The user has both factors enabled and we want to give them the option to use one 
*/

import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { getUserId, createUserSession } from '~/utils/session.server';
import { verifyLogin } from '~/models/user.server';
import { redirectSafely } from '~/utils/redirectSafely.server';
import { validateEmail } from '~/utils/validation.server';
import { workos } from '~/lib/workos.server';
import { LoginForm, TwoFactorForm } from '~/components/auth';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return null;
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const redirectTo = redirectSafely(formData.get('redirectTo'), '/');
  const remember = formData.get('remember');
  const { _action, ...values } = Object.fromEntries(formData);

  switch (_action) {
    /* After the user logs in, we check on the server if they're enrolled in 
       another authentication factor. If they are enrolled in only one factor, we immediately 
       create a challenge and update the UI according the returned data by the API
    */
    case 'login':
      if (!validateEmail(values.email as string)) {
        return json<ActionData>(
          { errors: { email: 'Email is invalid' } },
          { status: 400 },
        );
      }

      if (typeof values.password !== 'string') {
        return json<ActionData>(
          { errors: { password: 'Password is required' } },
          { status: 400 },
        );
      }

      if (values.password.length < 8) {
        return json<ActionData>(
          { errors: { password: 'Password is too short' } },
          { status: 400 },
        );
      }

      const user = await verifyLogin(values.email as string, values.password);

      if (!user) {
        return json<ActionData>(
          { errors: { email: 'Invalid email or password' } },
          { status: 400 },
        );
      }

      const hasMfaEnabled = user.totpFactorId || user.smsFactorId;

      if (!hasMfaEnabled) {
        return createUserSession({
          request,
          userId: user.id,
          remember: remember === 'on',
          redirectTo,
        });
      }

      // Has TOTP verification Enabled
      if (user.totpFactorId && !user.smsFactorId) {
        const authenticationChallenge = await workos.mfa.challengeFactor({
          authenticationFactorId: user.totpFactorId,
        });

        return {
          userId: user.id,
          authenticationChallenge,
          totpFactorId: user.totpFactorId,
        };
      }

      //  has SMS verification enabled
      if (user.smsFactorId && !user.totpFactorId) {
        const authenticationChallenge = await workos.mfa.challengeFactor({
          authenticationFactorId: user.smsFactorId,
        });

        return {
          userId: user.id,
          phoneNumber: user.phoneNumber!.substring(
            user.phoneNumber!.length - 3,
          ),
          authenticationChallenge,
          smsFactorId: user.smsFactorId,
        };
      }

      /* when the user has both factors enabled,
       we initially challenge the TOTP factor, if they would like to use SMS
       verification instead, they have to request it. This is because we don't want to 
       create two authentication challenges at the same time
      */

      // Has all factors enabled
      if (user.totpFactorId && user.smsFactorId) {
        const authenticationChallenge = await workos.mfa.challengeFactor({
          authenticationFactorId: user.totpFactorId,
        });
        return {
          userId: user.id,
          authenticationChallenge,
          totpFactorId: user.totpFactorId,
          smsFactorId: user.smsFactorId,
          phoneNumber: user.phoneNumber!.substring(
            user.phoneNumber!.length - 3,
          ),
        };
      }

    // User has all factors enabled and they want to use SMS
    case 'sms':
      const authenticationChallenge = await workos.mfa.challengeFactor({
        authenticationFactorId: values.smsFactorId as string,
      });

      return {
        authenticationChallenge,
        phoneNumber: values.phoneNumber,
        smsFactorId: values.smsFactorId,
        totpFactorId: values.totpFactorId,
        message: 'We sent a message to your registered phone number',
      };

    // Verify the submitted verification code along with the challenge
    case 'verify':
      const {
        authenticationCode,
        authenticationChallengeId,
        userId,
        totpFactorId,
        smsFactorId,
        phoneNumber,
      } = values;

      try {
        const response = await workos.mfa.verifyFactor({
          authenticationChallengeId: authenticationChallengeId as string,
          code: authenticationCode as string,
        });

        if (!response.valid) {
          return json(
            {
              totpFactorId,
              smsFactorId,
              authenticationChallenge: {
                id: authenticationChallengeId,
              },
              phoneNumber,
              errors: {
                verificationCode: `Invalid verification code`,
              },
            },
            { status: 400 },
          );
        }

        return createUserSession({
          request,
          userId: userId as string,
          remember: remember === 'on' ? true : false,
          redirectTo,
        });
      } catch (error) {
        switch (error.code) {
          case 'authentication_challenge_expired':
            return json(
              {
                totpFactorId,
                smsFactorId,
                authenticationChallengeId,
                errors: {
                  verificationCode: `The two factor authentication time-window has expired`,
                },
              },
              { status: 400 },
            );
          default:
            console.log(error);
        }
      }
  }
};

export const meta: MetaFunction = () => {
  return {
    title: 'Login',
  };
};

export default function LoginPage() {
  const actionData = useActionData();
  const hasMfaEnabled = actionData?.smsFactorId || actionData?.totpFactorId;

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8 my-20">
        <h1 className="text-4xl text-center text-gray-800 mb-10">Log in</h1>
        {!hasMfaEnabled && <LoginForm />}
        <TwoFactorForm />
      </div>
    </div>
  );
}
