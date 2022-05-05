import { gql } from "apollo-server"

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

export default typeDefinitions