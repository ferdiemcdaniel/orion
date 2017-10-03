const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers-mongo');

const typeDefs = `
    type Query {
        allLinks: [Link!]!
        allUsers: [User!]!
    }

    type Mutation {
        createLink(url: String!, description: String!): Link
        createVote(linkId: ID!): Vote
        createUser(name: String!, authProvider: AuthProviderSignupData!): User
        signinUser (email:AUTH_PROVIDER_EMAIL): SigninPayload!
    }

    type Vote {
        id: ID!
        user: User!
        link: Link!
    }

    type Link {
        id: ID!
        url: String!
        description: String!
        postedBy: User
        votes: [Vote!]!
    }

    type User {
        id: ID!
        name: String!
        email: String
        password: String
        votes: [Vote!]!
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
