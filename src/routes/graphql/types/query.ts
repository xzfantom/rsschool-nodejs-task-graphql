/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Profile } from './profile.js';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId } from './member.js';
import { Post } from './post.js';
import { User } from './user.js';

export const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    profiles: {
      type: new GraphQLList(Profile),
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const profiles = await prisma.profile.findMany();
        return profiles;
      },
    },
    profile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { id } = args;
        const profile = await prisma.profile.findUnique({
          where: { id },
        });
        return profile;
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (parent, args, context) => {
        const { prisma } = context;
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
      resolve: async (parent, args, context) => {
        const { prisma } = context;
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
      resolve: async (parent, args, context) => {
        const { prisma } = context;
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
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { id } = args;
        const post = await prisma.post.findUnique({
          where: { id },
        });
        return post;
      },
    },
    users: {
      type: new GraphQLList(User),
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const users = await prisma.user.findMany();
        // console.log(users);
        return users;
      },
    },
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { id } = args;
        const user = await prisma.user.findUnique({
          where: { id },
        });
        return user;
      },
    },
  }),
});
