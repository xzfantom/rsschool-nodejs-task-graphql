import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { Profile } from './profile.js';
import { Post } from './post.js';

const name = {
  type: new GraphQLNonNull(GraphQLString),
  description: 'Name of the user',
};

const balance = {
  type: new GraphQLNonNull(GraphQLFloat),
  description: 'User balance',
};

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  description: 'Input for creating a user',
  fields: () => ({
    name,
    balance,
  }),
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  description: 'Input for changing a user',
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  }),
});

export const User = new GraphQLObjectType({
  name: 'User',
  description: 'A user',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
      description: 'The id of the profile',
    },
    name,
    balance,
    profile: {
      type: Profile,
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { id } = parent;
        const profile = await prisma.profile.findUnique({
          where: { userId: id },
        });
        return profile;
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { id } = parent;
        const posts = await prisma.post.findMany({
          where: { authorId: id },
        });
        return posts;
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { id } = parent;
        const userSubscribedTo = await prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: id,
              },
            },
          },
        });

        return userSubscribedTo;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { id } = parent;
        const subscribedToUser = await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: id,
              },
            },
          },
        });

        return subscribedToUser;
      },
    },
  }),
});
