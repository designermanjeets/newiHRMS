const express = require('express')

// The reason why apollo-server-express is because later on for testing we use Supertest, which requires an app object
const { ApolloServer, AuthenticationError } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
// we don't have these yet, but don't worry we'll get there.
const context = require('./utils/context')
const schema = require('./modules')
const config = require('./config')

const server = new ApolloServer({
  schema,
  context: async ({req}) => {
    const me = await Authorization(req);
    return {
      me,
      secret:config.JWT_SECRET,
    };
  },
})

const app = express()

const Authorization = async req => {
  let token = req.headers['authorization']
  if(token)token = token.split(" ")[1];
  if (token) {
    try {
      // console.log("___token2",await jwt.verify(token, SECRET))
      return await jwt.verify(token, config.JWT_SECRET);//
    } catch (e) {
      throw new AuthenticationError(
        'JWT_EXPIRED',
      );
    }
  }
};

server.applyMiddleware({
  path: '/',
  app
})

module.exports = app
