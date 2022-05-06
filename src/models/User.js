import mongoose from "mongoose"

const schema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: 3 
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  friends: [
    {
      ref: 'Person',
      type: mongoose.Schema.Types.ObjectId
    }
  ]
})

export default mongoose.model('User', schema)