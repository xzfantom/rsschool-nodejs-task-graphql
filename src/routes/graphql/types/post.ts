import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';

const title = {
  type: new GraphQLNonNull(GraphQLString),
  description: 'Title of the post',
};

const content = {
  type: new GraphQLNonNull(GraphQLString),
  description: 'Content of the post',
};

const authorId = {
  type: new GraphQLNonNull(UUIDType),
  description: 'The id of the author',
};

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  description: 'Input for creating a post',
  fields: () => ({
    title,
    content,
    authorId,
  }),
});

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  description: 'Input for changing a post',
  fields: () => ({
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  }),
});

export const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'A post',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
      description: 'The id of the profile',
    },
    title,
    content,
    authorId,
  }),
});
