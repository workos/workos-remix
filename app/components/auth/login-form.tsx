import {
  Form,
  Link,
  useActionData,
  useSearchParams,
  useTransition,
} from '@remix-run/react';
import { Button, Label, TextInput } from '../shared';

export const LoginForm = () => {
  const actionData = useActionData();
  const transition = useTransition();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  return (
    <Form method="post" className="space-y-6">
      <div>
        <Label htmlFor="email">Email address</Label>
        <div className="mt-1">
          <TextInput
            id="email"
            required
            autoFocus={true}
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-describedby="email-error"
          />
          {actionData?.errors?.email && (
            <p className="pt-1 text-red-700" id="email-error">
              {actionData.errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="mt-1">
          <TextInput
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={actionData?.errors?.password ? true : undefined}
            aria-describedby="password-error"
          />
          {actionData?.errors?.password && (
            <div className="pt-1 text-red-700" id="password-error">
              {actionData.errors.password}
            </div>
          )}
        </div>
      </div>

      <input type="hidden" name="redirectTo" value={redirectTo} />

      <Button
        name="_action"
        value="login"
        isLoading={
          transition.state === 'submitting' &&
          transition.submission.formData.get('_action') === 'login'
        }
        type="submit"
      >
        Log in
      </Button>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <Label
            htmlFor="remember"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me
          </Label>
        </div>
        <div className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            className="text-indigo-500 underline"
            to={{
              pathname: '/signup',
              search: searchParams.toString(),
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </Form>
  );
};
