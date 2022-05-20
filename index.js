const { ApolloServer, gql } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  type Query {
    readBooks: [Book]
  }
  type Mutation {
    createBooks(title: String, author: String): Boolean
    updateBooks(id: Int, title: String, author: String): Boolean
    deleteBooks(id: Int): Boolean
  }
`;

const resolvers = {
  Query: {
    readBooks: (_, __, ___) => prisma.books.findMany(),
  },
  Mutation: {
    createBooks: async (_, { title, author }, ___) => {
      await prisma.books.create({ data: { title, author } });
      return true;
    },
    updateBooks: async (_, { id, title, author }, ___) => {
      await prisma.books.update({
        where: { id },
        data: { title, author },
      });
      return true;
    },
    deleteBooks: async (_, { id }, ___) => {
      await prisma.books.delete({
        where: { id },
      });
      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
