import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/User.js'

export const comparePasswords = (inputPassword, savedPassword) => {
  return bcrypt.compareSync(inputPassword, savedPassword)
}

export const decodeToken = async (authToken) => {
  const token = authToken.substring(7)
  const { id } = jwt.verify(token, process.env.JWT_SECRET)
  const currentUser = await User.findOne({ id }).populate('friends')
  return currentUser
}
