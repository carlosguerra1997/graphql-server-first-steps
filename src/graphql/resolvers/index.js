import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthenticationError, UserInputError } from "apollo-server"

import { comparePasswords } from '../../helpers/index.js'

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
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addPerson: async (root, args, {currentUser}) => {
      if (!currentUser) throw new AuthenticationError('Not authenticated')
      const person = new Person({ ...args })
      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
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
    },
    createUser: async (root, args) => {
      const salt = 10
      const passwordHashed = bcrypt.hashSync(args.password, salt)
      const user = new User({ username: args.username, password: passwordHashed })
      try {
        await user.save()
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args })
      }
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ name: args.name })
      if (!user) throw new UserInputError('Wrong credentials') 
      const isPasswordCorrect = comparePasswords(args.password, user.password)
      if (!isPasswordCorrect) throw new UserInputError('Wrong credentials')
      const userToken = { id: user._id, username: user.username }
      return { value: jwt.sign(userToken, process.env.JWT_SECRET) }
    },
    addAsFriend: async (root, args, {currentUser}) => {
      if (!currentUser) throw new AuthenticationError('Not authenticated')
      const person = await Person.findOne({ name: args.name })
      const nonFriendAlready = person => !currentUser.friend.map(p => p._id).includes(person._id)
      if (nonFriendAlready(person)) {
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      }
      return currentUser
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