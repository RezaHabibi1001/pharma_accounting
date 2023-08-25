const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar Upload
  scalar DateTime
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    password: String
    createdAt: DateTime
  }

  type Query {
    getUsers: [User]
  }
  type Mutation {
    addUser: [User]
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
module.exports = {
  typeDefs,
};
