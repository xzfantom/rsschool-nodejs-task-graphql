import { PrismaClient } from '@prisma/client';
import { UserType } from '../types/user.js';

export const getUsersById = async (prisma: PrismaClient, ids: readonly string[]) => {
  const users = await prisma.user.findMany({
    where: { id: { in: ids as string[] } },
    include: {
      userSubscribedTo: true,
      subscribedToUser: true,
    },
  });

  const userMap = users.reduce(
    (acc, user) => {
      acc[user.id] = user;
      return acc;
    },
    {} as Record<string, typeof UserType>,
  );

  return ids.map((id) => userMap[id]);
};
