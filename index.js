import { ApolloServer, gql } from "apollo-server"

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
    allPersons: [Person]!
    findPerson(name: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => people.length,
    allPersons: () => people,
    findPerson: (root, {name}) => {
      return people.find(person => person.name === name)
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