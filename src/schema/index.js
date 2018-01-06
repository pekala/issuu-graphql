const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type Publication {
    id: ID!
    title: String!
    issuuUrl: String!
    description: String
    publishedOn: String!
    owner: User!
    pageCount: Int!
    coverHWRatio: Float
    coverUrl: String!
  }

  type User {
    id: ID!
    username: String!
    displayName: String!
    url: String!
    issuuUrl: String!
    city: String
    about: String
    country: String
    publications: [Publication!]
    stacks: [Stack!]
    followers: [User!]
  }

  type Stack {
    id: ID!
    title: String!
    description: String!
    owner: User!
    subscriberCount: Int!
    itemsCount: Int!
    created: String!
    publications: [Publication!]
    followers: [User!]
  }

  type Query {
    allPublications: [Publication!]!
    getUser(username: String!): User!
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });