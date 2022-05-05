import { UserInputError } from "apollo-server"

import Person from '../../models/Person.js'
import User from '../../models/User.js'

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

export default resolvers