const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  enum OrderDirection {
    ASC
    DESC
  }

  enum PublicationOrderField {
    TITLE
    IMPRESSIONS
    PAGE_COUNT
    PUBLISHED_ON
  }

  input PublicationOrderInput {
    field: PublicationOrderField! = PUBLISHED_ON
    direction: OrderDirection! = ASC
  }

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
    publications(skip: Int = 0, first: Int = 10, orderBy: PublicationOrderInput): [Publication!]
    stacks(skip: Int = 0, first: Int = 10): [Stack!]
    followers(skip: Int = 0, first: Int = 10): [User!]
  }

  type Stack {
    id: ID!
    title: String!
    description: String!
    owner: User!
    subscriberCount: Int!
    itemsCount: Int!
    created: String!
    publications(skip: Int = 0, first: Int = 10, orderBy: PublicationOrderInput): [Publication!]
    followers(skip: Int = 0, first: Int = 10): [User!]
  }

  type Query {
    allPublications(skip: Int = 0, first: Int = 10, orderBy: PublicationOrderInput): [Publication!]!
    getUser(username: String!): User!
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });