import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { IContextType } from '../index.js';

export type IMemberType = {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
};

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  description: 'Member type enum',
  values: {
    basic: {
      value: 'basic',
      description: 'Basic member type.',
    },
    business: {
      value: 'business',
      description: 'Business member type.',
    },
  },
});

export const MemberType = new GraphQLObjectType<IMemberType, IContextType>({
  name: 'MemberType',
  description: 'A member type',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(MemberTypeId),
      description: 'The id of the member type',
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'Discount of the member type',
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Post limit per month of the member type',
    },
  }),
});
