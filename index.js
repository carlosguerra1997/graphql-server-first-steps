import { ApolloServer } from "apollo-server"

import conectarDB from './src/config/db.js'
import resolvers from './src/graphql/resolvers/index.js'
import typeDefinitions from './src/graphql/definitions/index.js'

conectarDB()

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers
})

server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`)
})