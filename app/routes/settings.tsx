import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { DeleteAccount, ChangePassword } from '~/components/settings';
import { Factors } from '~/components/settings/mfa/factors';
import {
  deleteUser,
  disable2FA,
  getUserAuthFactors,
  updatePassword,
} from '~/models/user.server';
import {
  cookieSessionStorage,
  getSession,
  requireUser,
  requireUserId,
} from '~/utils/session.server';
import { displayToast } from '~/utils/displayToast.server';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const userAuthFactors = await getUserAuthFactors(userId);

  return userAuthFactors;
};

const badRequest = (data: { formError: string }) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const { session } = await getSession(request);
  const user = await requireUser(request);
  let formData = await request.formData();
  let { _action } = Object.fromEntries(formData);

  switch (_action) {
    case 'updatePassword':
      let currentPassword = formData.get('currentPassword');
      let newPassword = formData.get('newPassword');

      if (
        typeof currentPassword !== 'string' ||
        typeof newPassword !== 'string'
      ) {
        return badRequest({ formError: `Form not submitted correctly.` });
      }

      if (!currentPassword || !newPassword) {
        return json(
          { errors: { message: 'This field is required' } },
          { status: 400 },
        );
      }
      const res = await updatePassword(user.id, currentPassword, newPassword);

      if (res) {
        displayToast(
          session,
          'Your password has been updated successfully',
          'success',
        );

        return redirect('/settings', {
          headers: {
            'Set-Cookie': await cookieSessionStorage.commitSession(session),
          },
        });
      }
      return res;

    case 'toggle2FA':
      if (!user.totpFactorId && !user.smsFactorId) {
        return redirect('/settings/two-factor-authentication');
      }
      try {
        await disable2FA(user.id);
        displayToast(session, 'You have successfully disabled 2FA', 'success');

        return redirect('/settings', {
          headers: {
            'Set-Cookie': await cookieSessionStorage.commitSession(session),
          },
        });
      } catch (error) {
        displayToast(
          session,
          'Something went wrong, please try again',
          'error',
        );

        return redirect('/settings', {
          headers: {
            'Set-Cookie': await cookieSessionStorage.commitSession(session),
          },
        });
      }

    case 'deleteAccount':
      await deleteUser(user.id);
      return redirect('/signup');
  }
};

export default function Settings() {
  return (
    <section className="my-10">
      <h1 className="text-3xl">Settings</h1>
      <div className="space-y-10 mt-5">
        <ChangePassword />
        <Factors />
        <DeleteAccount />
      </div>
    </section>
  );
}
