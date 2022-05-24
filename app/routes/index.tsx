import { Link } from '@remix-run/react';
import { useOptionalUser } from '~/hooks/useOptionalUser';

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-white ">
      {user ? (
        <Link
          to="/settings"
          className="max-w-sm mx-auto mt-40 flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base  text-indigo-700 shadow-md hover:bg-indigo-50 sm:px-8"
        >
          Settings
        </Link>
      ) : (
        <div>
          <p className="text-xl leading-relaxed text-center mt-40">
            Remix auth + Multi-Factor Authentication example app.
            <br /> Powered by the{' '}
            <a className="text-indigo-500" href="https://workos.com/docs/mfa/">
              WorkOS Multi-factor authentication API
            </a>{' '}
          </p>
          <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none">
            {user ? (
              <Link
                to="/settings"
                className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base  text-indigo-700 shadow-md hover:bg-indigo-50 sm:px-8"
              >
                Settings
              </Link>
            ) : (
              <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                <Link
                  to="/signup"
                  className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base  text-indigo-700 shadow-md hover:bg-indigo-50 sm:px-8"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center rounded-md bg-indigo-500 px-4 py-3  text-white hover:bg-indigo-600  "
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
          <div className="mt-20 flex flex-wrap justify-center gap-8">
            {[
              {
                src: 'https://user-images.githubusercontent.com/27310414/169316398-8b43fba5-ded3-4bd7-9f97-efe8bf3251e6.svg',
              },
              {
                src: 'https://user-images.githubusercontent.com/27310414/169313861-d3e245c9-c79f-4d2e-874d-f6d719f7c2dc.svg',
                alt: 'WorkOS',
                href: 'https://workos.com',
              },
              {
                src: 'https://user-images.githubusercontent.com/27310414/169313872-22a66661-fa3b-43e5-aba1-3a3f10e9e8c5.svg',
                alt: 'Remix',
                href: 'https://remix.run',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157764395-137ec949-382c-43bd-a3c0-0cb8cb22e22d.svg',
                alt: 'SQLite',
                href: 'https://sqlite.org',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg',
                alt: 'Prisma',
                href: 'https://prisma.io',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg',
                alt: 'Tailwind',
                href: 'https://tailwindcss.com',
              },

              {
                src: 'https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg',
                alt: 'Prettier',
                href: 'https://prettier.io',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg',
                alt: 'ESLint',
                href: 'https://eslint.org',
              },
              {
                src: 'https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg',
                alt: 'TypeScript',
                href: 'https://typescriptlang.org',
              },
            ].map((img) => (
              <a
                key={img.href}
                href={img.href}
                className="flex h-16 w-32 justify-center p-1"
              >
                <img alt={img.alt} src={img.src} />
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
