const express = require('express');
const bodyParser = require('body-parser');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
const {authenticate} = require('./authentication');

const schema = require('./schema');

const connectMongo = require('./mongo-connector');
const start = async () => {
    const mongo = await connectMongo();
    const buildOptions = async (req, res) => {
        const user = await authenticate(req, mongo.Users);
        return {
            context: {mongo, user},
            schema,
        };
    };
    let app = express();
    app.use(
        '/graphql',
        bodyParser.json(),
        graphqlExpress(buildOptions)
    );
    app.use(
        '/graphiql',
        graphiqlExpress({
            endpointURL: '/graphql',
        })
    );
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Hackernews GraphQL server running on port ${PORT}.`);
    });
};

start();
