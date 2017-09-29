const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers-mongo');

const typeDefs = `
    //GraphQL native type definitions
    type Query {
        allLinks: [Link!]!
        allUsers: [User!]!
    }

    type Mutation {
        createLink(url: String!, description: String!): Link
        createUser(name: String!, authProvider: AuthProviderSignupData!): User
        signinUser (email:AUTH_PROVIDER_EMAIL): SigninPayload!
    }

    //Custom type definitions
    type Link {
        id: ID!
        url: String!
        description: String!
        postedBy: User
    }

    type User {
        id: ID!
        name: String!
        email: String
    }

    type SigninPayload {
        token: String
        user: User
    }
    
    input AuthProviderSignupData{
        email: AUTH_PROVIDER_EMAIL
    }

    input AUTH_PROVIDER_EMAIL {
        email: String!
        password: String!
    }

`;

module.exports = makeExecutableSchema({typeDefs, resolvers});
