import { gql } from 'apollo-boost'

export const typeDefs = gql `
  extend type Mutation {
    updateBg(bgcolor: String!) : String!
  }
`;

export const resolvers = {
  Mutation: {
    updateBg(_, { bgcolor}) {
      return bgcolor
    }
  }
};