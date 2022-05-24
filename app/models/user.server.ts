import type { Password, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '~/lib/prisma.server';
export type { User } from '@prisma/client';

export async function getUserById(userId: User['id']) {
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function getUserByEmail(email: User['email']) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function getUserAuthFactors(userId: User['id']) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      smsFactorId: true,
      totpFactorId: true,
    },
  });
}

export async function deleteUser(userId: User['id']) {
  return await prisma.user.delete({
    where: { id: userId },
  });
}

interface factors {
  totpFactorId?: User['totpFactorId'] | undefined;
  smsFactorId?: User['smsFactorId'] | undefined;
}

export async function enrollAuthenticationFactor(
  userId: User['id'],
  factors: factors = { totpFactorId: undefined, smsFactorId: undefined },
) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      totpFactorId: factors.totpFactorId,
      smsFactorId: factors.smsFactorId,
    },
  });
}

export async function disable2FA(userId: User['id']) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      smsFactorId: null,
      totpFactorId: null,
    },
  });
}

export async function updatePhoneNumber(
  userId: User['id'],
  phoneNumber: string,
) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      phoneNumber,
    },
  });
}

export async function updatePassword(
  userId: User['id'],
  currentPassword: string,
  newPassword: string,
) {
  const userWithPassword = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    currentPassword,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: {
        update: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function createUser(email: User['email'], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function verifyLogin(
  email: User['email'],
  password: Password['hash'],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
