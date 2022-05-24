import type { User } from '~/models/user.server';

export const isUser = (user: User) => {
  return user && typeof user === 'object' && typeof user.email === 'string';
};
