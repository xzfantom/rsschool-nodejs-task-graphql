import { PrismaClient } from '@prisma/client';
import { IPost } from '../types/post.js';

export const getPostsByUserId = async (prisma: PrismaClient, ids: readonly string[]) => {
  const posts = await prisma.post.findMany({
    where: { authorId: { in: ids as string[] } },
  });

  const postMap = posts.reduce(
    (acc, post) => {
      acc[post.authorId] ? acc[post.authorId].push(post) : (acc[post.authorId] = [post]);
      return acc;
    },
    {} as Record<string, IPost[]>,
  );

  return ids.map((id) => postMap[id]);
};
