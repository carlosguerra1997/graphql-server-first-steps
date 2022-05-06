import { ApolloServer } from "apollo-server"

import conectarDB from './src/config/db.js'
import { decodeToken } from './src/helpers/index.js'
import resolvers from './src/graphql/resolvers/index.js'
import typeDefinitions from './src/graphql/definitions/index.js'

conectarDB()

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLocaleLowerCase().startsWith('bearer ')) {
      const currentUser = await decodeToken(auth)
      return { currentUser }
    }
  }
})

server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`)
})