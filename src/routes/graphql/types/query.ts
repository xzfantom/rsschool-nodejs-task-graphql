import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Profile } from './profile.js';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId } from './member.js';
import { Post } from './post.js';
import { UserType } from './user.js';
import { IContextType } from '../index.js';

export const Query = new GraphQLObjectType<unknown, IContextType>({
  name: 'Query',
  fields: () => ({
    profiles: {
      type: new GraphQLList(Profile),
      resolve: async (_parent, _args, context) => {
        const { fastify } = context;
        const { prisma } = fastify;
        const profiles = await prisma.profile.findMany();
        return profiles;
      },
    },
    profile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, args, context) => {
        const { fastify } = context;
        const { prisma } = fastify;
        const { id } = args;
        const profile = await prisma.profile.findUnique({
          where: { id },
        });
        return profile;
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_parent, _args, context) => {
        const { fastify } = context;
        const { prisma } = fastify;
        const memberTypes = await prisma.memberType.findMany();
        // console.log(memberTypes);
        return memberTypes;
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (_parent, args, context) => {
        const { fastify } = context;
        const { prisma } = fastify;
        const { id } = args;
        const memberType = await prisma.memberType.findUnique({
          where: { id },
        });
        console.log(memberType);
        return memberType;
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async (_parent, _args, context) => {
        const { fastify } = context;
        const { prisma } = fastify;
        const posts = await prisma.post.findMany();
        // console.log(posts);
        return posts;
      },
    },
    post: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, args, context) => {
        const { fastify } = context;
        const { prisma } = fastify;
        const { id } = args;
        const post = await prisma.post.findUnique({
          where: { id },
        });
        return post;
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_parent, _args, { userLoader, fastify }: IContextType) => {
        const { prisma } = fastify;
        const users = await prisma.user.findMany({
          include: {
            userSubscribedTo: true,
            subscribedToUser: true,
          },
        });

        users.forEach((user) => {
          console.log('USER', user.userSubscribedTo);
          userLoader.prime(user.id, user);
        });

        return users;
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, args: { id: string }, { userLoader }: IContextType) => {
        const user = await userLoader.load(args.id);
        return user;
      },
    },
  }),
});
