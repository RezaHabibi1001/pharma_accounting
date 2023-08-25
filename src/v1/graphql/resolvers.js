const { getUsers, addUser } = require("../controllers/userController");

const resolvers = {
  Mutation: { addUser },
  Query: {
    getUsers,
  },
};

module.exports = {
  resolvers,
};
