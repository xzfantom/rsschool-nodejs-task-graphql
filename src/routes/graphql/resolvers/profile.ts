import { PrismaClient } from '@prisma/client';
import { IProfile } from '../types/profile.js';

export const getProfileByUserId = async (
  prisma: PrismaClient,
  ids: readonly string[],
) => {
  const profiles = await prisma.profile.findMany({
    where: { userId: { in: ids as string[] } },
  });

  const profileMap = profiles.reduce(
    (acc, profile) => {
      acc[profile.userId] = profile;
      return acc;
    },
    {} as Record<string, IProfile>,
  );

  return ids.map((id) => profileMap[id]);
};
