/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { ChangeProfileInput, CreateProfileInput, Profile } from './profile.js';
import { ChangePostInput, CreatePostInput, Post } from './post.js';
import { ChangeUserInput, CreateUserInput, UserType } from './user.js';
import { UUIDType } from './uuid.js';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createPost: {
      type: Post,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },

      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { title, content, authorId } = args.dto;
        const newPost = await prisma.post.create({
          data: { title, content, authorId },
        });
        return newPost;
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { id } = args;
        try {
          await prisma.post.delete({
            where: { id },
          });
        } catch (error) {
          return false;
        }

        return true;
      },
    },
    changePost: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { id, dto } = args;
        const updatedPost = await prisma.post.update({
          where: { id },
          data: dto,
        });

        return updatedPost;
      },
    },
    createUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { name, balance } = args.dto;
        const newUser = await prisma.user.create({
          data: { name, balance },
        });
        return newUser;
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { id } = args;
        await prisma.user.delete({
          where: { id },
        });
        return true;
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { id, dto } = args;
        const updatedUser = await prisma.user.update({
          where: { id },
          data: dto,
        });

        return updatedUser;
      },
    },
    createProfile: {
      type: Profile,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { yearOfBirth, userId, memberTypeId, isMale } = args.dto;
        const newProfile = await prisma.profile.create({
          data: { yearOfBirth, userId, memberTypeId, isMale },
        });
        return newProfile;
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { id } = args;
        await prisma.profile.delete({
          where: { id },
        });

        return true;
      },
    },
    changeProfile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { id, dto } = args;
        const updatedProfile = await prisma.profile.update({
          where: { id },
          data: dto,
        });

        return updatedProfile;
      },
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { userId, authorId } = args;
        const updatedUser = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId: authorId,
              },
            },
          },
        });

        return updatedUser;
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { userId, authorId } = args;
        const updatedUser = await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });

        return true;
      },
    },
  }),
});
