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

  type User {
    id: ID!
    username: String!
    password: String!
    friends: [Person]!
  }

  type Token {
    value: String!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
    me: User
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
    createUser(
      username: String!
      password: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
    addAsFriend(
      name: String!
    ): User
  }
`

export default typeDefinitions