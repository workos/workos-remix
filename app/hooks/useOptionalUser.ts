import type { User } from '~/models/user.server';
import { isUser } from '~/utils/validation';
import { useMatchesData } from './useMatchesData';

export const useOptionalUser = (): User | undefined => {
  const data = useMatchesData('root');
  if (!data || !isUser(data.user)) {
    return;
  }
  return data.user;
};
