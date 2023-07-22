import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId } from './member.js';

const isMale = {
  type: new GraphQLNonNull(GraphQLBoolean),
  description: 'Gender of the profile',
};

const yearOfBirth = {
  type: new GraphQLNonNull(GraphQLInt),
  description: 'Year of birth of the profile',
};

const userId = {
  type: new GraphQLNonNull(UUIDType),
  description: 'The id of the user',
};

const memberTypeId = {
  type: new GraphQLNonNull(MemberTypeId),
};

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  description: 'Input for creating a profile',
  fields: () => ({
    isMale,
    yearOfBirth,
    userId,
    memberTypeId,
  }),
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  description: 'Input for changing a profile',
  fields: () => ({
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    memberTypeId: {
      type: MemberTypeId,
    },
  }),
});

export const Profile = new GraphQLObjectType({
  name: 'Profile',
  description: 'A profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
      description: 'The id of the profile',
    },
    isMale,
    yearOfBirth,
    userId,
    memberTypeId,
    memberType: {
      type: MemberType,
      resolve: async (parent, args, context) => {
        const { prisma } = context;
        const { memberTypeId } = parent;
        const memberType = await prisma.memberType.findUnique({
          where: { id: memberTypeId },
        });
        return memberType;
      },
    },
  }),
});
