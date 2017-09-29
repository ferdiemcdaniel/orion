const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers-mongo');

const typeDefs = `
    type Link {
        id: ID!
        url: String!
        description: String!
    }

    type Query {
        allLinks: [Link!]!
        allUsers: [User!]!
    }

    type Mutation {
        createLink(url: String!, description: String!): Link
    }
`;

module.exports = makeExecutableSchema({typeDefs, resolvers});
