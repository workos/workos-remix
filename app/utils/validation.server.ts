export const validateEmail = (email: string) => {
  return typeof email === 'string' && email.length > 3 && email.includes('@');
};
