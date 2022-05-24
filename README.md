# Remix with WorkOS

Remix auth + Multi-Factor Authentication (MFA) example app. Powered by the [WorkOS Multi-factor authentication API](https://workos.com/docs/mfa/guide)

Built using the following tools and libraries:
- [Remix](https://remix.run) - fullstack React framework built on top of Web standards
- [WorkOS MFA API](https://workos.com/docs/mfa/guide) + WorkOS SDK - WorkOS API that enables you to add SMS/TOTP (Time-based One Time Passwords) verification codes 
- [TailwindCSS](https://tailwindcss.com) - utility first CSS framework
- [Prisma](https://prisma.io) - type-safe ORM
- [Radix UI](https://radix-ui.com) - unstyled, accessible, React components
  - [Alert Dialog](https://radix-ui.com/docs/primitives/components/alert-dialog)
  - [Icons](https://icons.modulz.app/)
  - [Dialog](https://radix-ui.com/docs/primitives/components/dialog)
  - [Radio group](https://radix-ui.com/docs/primitives/components/radio-group)
- [react-hot-toast](https://react-hot-toast.com/) - library for displaying toasts
- [react-verification input](https://npmjs.com/package/react-verification-input) - masked input for submitting verification codes
- TypeScript -  type-safe JS
## Set up the  project locally

1. Clone the repository and install the dependencies by running the following commands:

```bash
git clone https://github.com/workos/remix-mfa

cd remix-mfa

npm install

```

2. Rename the `.env.example` file to `.env` by running the following command:

```bash
cp .env.example .env
```

1. First, create a [WorkOS account](https://dashboard.workos.com/signup). Next, in the left sidebar, navigate to the "API keys" tab, create a new API key and add it to the `.env` file in your project .

```bash
WORKOS_API_KEY=''
```

> *Note*: You can test WorkOS for free, you only get charged when you go to production 

4. Set the `SESSION_SECRET` environment variable. You can generate a random secret by running the following command:

```bash
openssl rand -base64 32
```

5. Setup Prisma by running the following command:

```bash
npx prisma db push
```

They will create a `prisma/data.db` SQLite file

6. Start the development server

```bash
npm run dev
```

You'll see the app running at `http://localhost:3000`. Navigate to the sign up page at `http://localhost:3000/signup` and create a new user. You'll then be logged in and you can go to the settings page where you can configure MFA.

## Code Architecture

You'll see the following folder structure:

```
remix-with-workos/
┣ app/
┃ ┣ components/
┃ ┃ ┣ auth/
┃ ┃ ┣ layout/
┃ ┃ ┣ settings/
┃ ┃ ┗ shared/
┃ ┣ hooks/
┃ ┃ ┣ useMatchesData.ts
┃ ┃ ┣ useOptionalUser.ts
┃ ┃ ┗ useUser.ts
┃ ┣ lib/
┃ ┃ ┣ prisma.server.ts
┃ ┃ ┗ workos.server.ts
┃ ┣ models/
┃ ┃ ┗ user.server.ts
┃ ┣ routes/
┃ ┃ ┣ index.tsx
┃ ┃ ┣ login.tsx
┃ ┃ ┣ logout.tsx
┃ ┃ ┣ settings.tsx
┃ ┃ ┣ settings.two-factor-authentication.tsx
┃ ┃ ┗ signup.tsx
┃ ┣ styles/
┃ ┃ ┗ app.css
┃ ┣ utils/
┃ ┃ ┣ validation/
┃ ┃ ┣ displayToast.server.ts
┃ ┃ ┣ redirectSafely.server.ts
┃ ┃ ┗ session.server.ts
┃ ┣ entry.client.tsx
┃ ┣ entry.server.tsx
┃ ┗ root.tsx
┣ prisma/
┃ ┣ data.db
┃ ┗ schema.prisma
┣ public/
┃ ┗ favicon.ico
┣ styles/
┃ ┗ app.css
┣ .env.example
┣ .eslintrc
┣ .gitignore
┣ .prettierrc
┣ README.md
┣ package-lock.json
┣ package.json
┣ postcss.config.js
┣ remix.config.js
┣ remix.env.d.ts
┣ server.js
┣ tailwind.config.js
┣ tsconfig.json
┗ vercel.json
```

- `/app` directory:
  - `/app/components`:
    - `components/auth`: directory containing auth-related components (login form, verification input, two-factor form)
    - `/components/layout`: layout components (Navbar, Footer, etc.)
    - `/components/settings`: components for the settings page (configuring MFA, deleting a user's account, changing password)
    - `components/shared`: reusable, shared components (e.g button, form input, etc.)
    - `components/hooks`: reusable React hooks used on the client
  - `app/lib`: contains files where different libraries are instantiated
  - `app/models`: contains database CRUD logic/operations
  - `app/routes`: contains the different routes for the app.
  - `app/styles`: generated tailwindcss utilities coming from `/styles`
  - `app/utils`: utility functions
  - `entry.client.tsx`: 
  - `entry.server.tsx`:
  - `root.tsx`
- `/prisma`:
  - `data.db`: SQLite database
  - `schema.prisma`: database schema (download the Prisma [VS code extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) for syntax highlighting)
- `tailwind.config.js` and `postcss.config.js`: tailwind configuration files

There's also linting using [ESLint](https://eslint.org) and code formatting using [Prettier](https://prettier.io)

This app is configured to deploy to [Vercel](https://vercel.com), but you can deploy to other platforms as well. Check out the Remix [deployment docs](https://remix.run/docs/en/v1/guides/deployment) to learn more

## Going to production

This demo uses SQLite for simplicity purposes, however for you app you might go with a different database solution such as PostgreSQL, MySQL or MongoDB. To switch database providers, all you need to do is `provider` field in your `/prisma/schema.prisma` file.

## Future improvements

List of features 

- [ ] Create an email sending endpoint
  - [ ] Send an email to the the logged in user when an authentication factor has been added
  - [ ] Send an email to the logged in user when an authentication factor has been removed
- [ ] Forgot password functionality
