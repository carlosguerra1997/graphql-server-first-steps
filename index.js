import conectarDB from './src/config/db.js'
import { ApolloServer, gql, UserInputError } from "apollo-server"
import { v4 as uuid } from 'uuid';
import Person from './src/models/Person.js'

conectarDB()

const typeDefinitions = gql`
  enum YesNo {
    YES
    NO
  }

  type Address {
    city: String!
    street: String!
  }

  type Person {
    id: ID!
    name: String!
    phone: String
    address: Address!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      city: String!
      street: String!
    ): Person
    editNumber(
      name: String!
      phone: String!
    ): Person
  }
`

const resolvers = {
  Query: {
    personCount: async () => await Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) return await Person.find({})
      else return await Person.find({ phone: { $exists: args.phone === 'YES' } })
    },
    findPerson: async (root, {name}) => {
      return await Person.findOne({ name })
    }
  },
  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args })
      try {
        await person.save()
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args })
      }
      return person
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      if (!person) return
      person.phone = args.phone
      try {
        await person.save()
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args })
      }
      return person
    }
  },
  Person: {
    address: (root) => {
      return { 
        city: root.city, 
        street: root.street 
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers
})

server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`)
})