import { ApolloServer, gql, UserInputError } from "apollo-server"
import { v4 as uuid } from 'uuid';
import axios from 'axios'

const people = [
    {
        id: "757121-1234-1481-12399123",
        name: "Carlos",
        phone: "34-612918234",
        city: "Logronio",
        street: "Calle Estambrera"
    },
    {
        id: "757121-1234-1481-1234124",
        name: "Pedro",
        city: "Logronio",
        street: "Avda. La Paz"
    },
    {
        id: "757121-1234-1481-7652176",
        name: "Javier",
        phone: "34-654827654",
        city: "Madrid",
        street: "Gran via"
    }
  ]


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
    personCount: () => people.length,
    allPersons: async (root, args) => {
      const { data: peopleFromRestApi } = await axios.get('http://localhost:3000/people')
      if (!args.phone) return people
      return peopleFromRestApi.filter(person => args.phone === "YES" ? person.phone : !person.phone)
    },
    findPerson: (root, {name}) => {
      return people.find(person => person.name === name)
    }
  },
  Mutation: {
    addPerson: (root, args) => {
      if (people.find(p => p.name === args.name)) {
        throw new UserInputError('Name must be unique', { invalidArgs: args.name })
      }
      const person = {...args, id: uuid()}
      people.push(person)
      return person
    },
    editNumber: (root, args) => {
      const personIndex = people.findIndex(p => p.name === args.name)
      if (personIndex === -1) return null
      const person = people[personIndex]
      const updatedPerson = { ...person, phone: args.phone }
      people[personIndex] = updatedPerson
      return updatedPerson
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