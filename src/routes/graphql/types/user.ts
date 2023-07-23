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
import { IContextType } from '../index.js';

type ISubscription = {
  subscriberId: string;
  authorId: string;
};

export type IUser = {
  id: string;
  name: string;
  balance: number;
  subscribedToUser: ISubscription[];
  userSubscribedTo: ISubscription[];
};

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

export const UserType = new GraphQLObjectType<IUser, IContextType>({
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
      resolve: async (parent, _args, { profileLoader }) => {
        return profileLoader.load(parent.id);
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async (parent, _args, { postLoader }: IContextType) => {
        return postLoader.load(parent.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (parent, _args, { userLoader }: IContextType) => {
        return parent.userSubscribedTo
          ? userLoader.loadMany(
              parent.userSubscribedTo.map(({ subscriberId }) => subscriberId),
            )
          : [];
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (parent, _args, { userLoader }) => {
        return parent.subscribedToUser
          ? userLoader.loadMany(parent.subscribedToUser.map(({ authorId }) => authorId))
          : [];
      },
    },
  }),
});
