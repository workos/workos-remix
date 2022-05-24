import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import toast, { Toaster } from 'react-hot-toast';
import { Navbar } from './components/layout/navbar';
import styles from './styles/app.css';
import {
  getSession,
  getUser,
  cookieSessionStorage,
} from '~/utils/session.server';
import type { ToastMessage } from './utils/displayToast.server';
import { useEffect } from 'react';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'WorkOS + Remix',
  viewport: 'width=device-width,initial-scale=1',
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  toastMessage?: ToastMessage | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await getSession(request);
  const user = await getUser(request);
  const toastMessage = session.get('toastMessage') as ToastMessage;

  if (!toastMessage) {
    return json<LoaderData>({ toastMessage, user });
  }

  if (!toastMessage.type) {
    throw new Error('Message should have a type');
  }

  return json<LoaderData>(
    {
      user,
      toastMessage: toastMessage ? toastMessage : null,
    },
    {
      headers: {
        'Set-Cookie': await cookieSessionStorage.commitSession(session),
      },
    },
  );
};

export default function App() {
  const { toastMessage } = useLoaderData<LoaderData>();

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const { message, type } = toastMessage;

    switch (type) {
      case 'success':
        toast.success(message, {
          duration: 4000,
        });
        break;
      case 'error':
        toast.error(message, { duration: 4000 });
        break;
    }
  }, [toastMessage]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div>
          <Navbar />
          <main className="p-6 max-w-2xl mx-auto">
            <Outlet />
            <Toaster />
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
