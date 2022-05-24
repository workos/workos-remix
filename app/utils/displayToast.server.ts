import type { Session } from '@remix-run/node';

export type ToastMessage = { message: string; type: 'success' | 'error' };

export function displayToast(
  session: Session,
  message: string,
  type = 'success',
) {
  return session.flash('toastMessage', {
    message,
    type,
  } as ToastMessage);
}
