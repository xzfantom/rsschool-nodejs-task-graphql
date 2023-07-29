import { PrismaClient } from '@prisma/client';
import { IProfile } from '../types/profile.js';
import { IMemberType } from '../types/member.js';

export const getMemberType = async (prisma: PrismaClient, ids: readonly string[]) => {
  const types = await prisma.memberType.findMany({
    where: { id: { in: ids as string[] } },
  });

  const typesMap = types.reduce(
    (acc, type) => {
      acc[type.id] = type;
      return acc;
    },
    {} as Record<string, IMemberType>,
  );

  return ids.map((id) => typesMap[id]);
};
