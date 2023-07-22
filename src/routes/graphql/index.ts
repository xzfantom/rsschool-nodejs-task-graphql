import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GraphQLSchema, graphql, parse, validate } from 'graphql';
import { Query } from './types/query.js';
import { Mutation } from './types/mutation.js';
import depthLimit from 'graphql-depth-limit';

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

      console.log('queryBody:', queryBody, variablesBody);

      return await graphql({
        schema,
        source: queryBody,
        variableValues: variablesBody,
        contextValue: fastify,
      });
    },
  });
};

export default plugin;
