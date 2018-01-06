const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const depthLimit = require('graphql-depth-limit');
const schema = require('./schema');

var app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress(req => {
    return {
        schema,
        validationRules: [depthLimit(4)],
        context: { req }
    };
}));
app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
}));

const PORT = 3000
app.listen(PORT, () => {
    console.log(`GraphQL server running on port ${PORT}.`)
});
