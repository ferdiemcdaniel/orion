const {ObjectID} = require('mongodb');
module.exports = {
    Query: {
        allLinks: async (root, data, {mongo: {Links}}) =>
            await Links.find({}).toArray(),
        allUsers: async (root, data, {mongo: {Users}}) =>
            await Users.find({}).toArray(),
    },
    Mutation: {
        createLink: async (root, data, {mongo: {Links}, user}) => {
            const newLink = Object.assign({postedById: user && user._id}, data);
            const response = await Links.insert(newLink);
            return Object.assign({id: response.insertedIds[0]}, newLink);
        },
        createUser: async (root, data, {mongo: {Users}}) => {
            const newUser = {
                name: data.name,
                email: data.authProvider.email.email,
                password: data.authProvider.email.password,
            };
            const response = await Users.insert(newUser);
            return Object.assign({id: response.insertedIds[0]}, newUser);
        },
        createVote: async (root, data, {mongo: {Votes}, user}) => {
            const newVote = {
                userId: user && user._id,
                linkId: new ObjectID(data.linkId),
            };
            const response = await Votes.insert(newVote);
            return Object.assign({id: response.insertedIds[0]}, newVote);
        },
        signinUser: async (root, data, {mongo: {Users}}) => {
            const user = await Users.findOne({email: data.email.email});
            if (data.email.password === user.password) {
                return {token: `token-${user.email}`, user};
            }
        },
    },

    Link: {
        id: root => root._id || root.id,

        postedBy: async ({postedById}, data, {dataloaders: {userLoader}}) => {
            return await userLoader.load(postedById);
        },
        votes: async ({_id}, data, {mongo: {Votes}}) => {
            return await Votes.find({linkId: _id}).toArray();
        },
    },
    User: {
        id: root => root._id || root.id,
        votes: async ({_id}, data, {mongo: {Votes}}) => {
            return await Votes.find({userId: _id}).toArray();
        },
    },
    Vote: {
        id: root => root._id || root.id,
        user: async ({userId}, data, {dataloaders: {userLoader}}) => {
            return await userLoader.load(userId);
        },
        link: async ({linkId}, data, {mongo: {Links}}) => {
            return await Links.findOne({_id: linkId});
        },
    },
};
