import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql, parse, validate } from 'graphql';
import { Query } from './types/query.js';
import { Mutation } from './types/mutation.js';
import depthLimit from 'graphql-depth-limit';
import DataLoader from 'dataloader';
import { IUser } from './types/user.js';
import { FastifyInstance } from 'fastify';
import { getUsersById } from './resolvers/user.js';
import { IPost } from './types/post.js';
import { getPostsByUserId } from './resolvers/posts.js';
import { IProfile } from './types/profile.js';
import { getProfileByUserId } from './resolvers/profile.js';
import { IMemberType } from './types/member.js';
import { getMemberType } from './resolvers/memberType.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const schema = new GraphQLSchema({
        query: Query,
        mutation: Mutation,
      });

      const queryBody = req.body.query;
      const variablesBody = req.body.variables;

      const errors = validate(schema, parse(queryBody), [depthLimit(5)]);
      if (errors.length > 0) {
        return {
          errors,
        };
      }

      const userLoader = new DataLoader<string, IUser[]>((keys) =>
        getUsersById(fastify.prisma, keys),
      );

      const postLoader = new DataLoader<string, IPost[]>((keys) =>
        getPostsByUserId(fastify.prisma, keys),
      );

      const profileLoader = new DataLoader<string, IProfile>((keys) =>
        getProfileByUserId(fastify.prisma, keys),
      );

      const memberTypeLoader = new DataLoader<string, IMemberType>((keys) =>
        getMemberType(fastify.prisma, keys),
      );

      return await graphql({
        schema,
        source: queryBody,
        variableValues: variablesBody,
        contextValue: {
          fastify,
          userLoader,
          postLoader,
          profileLoader,
          memberTypeLoader,
        },
      });
    },
  });
};

export default plugin;

export type IContextType = {
  fastify: FastifyInstance;
  userLoader: DataLoader<string, IUser>;
  postLoader: DataLoader<string, IPost>;
  profileLoader: DataLoader<string, IProfile>;
  memberTypeLoader: DataLoader<string, IMemberType>;
};
