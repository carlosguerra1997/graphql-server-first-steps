import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    minlength: 5 
  },
  phone: { 
    type: String, 
    minlength: 5 
  },
  city: { 
    type: String, 
    required: true, 
    minlength: 3 
  },
  street: { 
    type: String, 
    required: true, 
    minlength: 5 
  }
})

export default mongoose.model('Person', schema)