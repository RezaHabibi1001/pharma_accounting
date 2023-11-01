const { makeExecutableSchema } = require("@graphql-tools/schema");
const { ApolloServer } = require("apollo-server-express");
const constructResolvers = require("./graphql/resolvers");
const constructSchema = require("./graphql/schema");
const typeDefs = constructSchema.typeDefs;
const resolvers = constructResolvers.resolvers;
const { ApolloArmor } = require("@escape.tech/graphql-armor");
const {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} = require("@apollo/server/plugin/landingPage/default");

const armor = new ApolloArmor({
  maxAliases: {
    n: 3,
    onAccept: [],
    onReject: [],
    throwOnRejection: true,
  },
  maxDirectives: {
    n: 10,
  },
  maxDepth: {
    n: 10,
  },
});

const protection = armor.protect();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV != "production",
});

const apolloServer = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res }),
  ...protection,
  plugins: [
    ...protection.plugins,
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault()
      : ApolloServerPluginLandingPageLocalDefault({ embed: false }),
  ],
  validationRules: [...protection.validationRules],
  allowBatchedHttpRequests: true,
  debug: true,
});

module.exports = apolloServer;
