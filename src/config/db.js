import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config()

const conectarDB = async () => {
  try {
      await mongoose.connect( process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
      });
      console.log('BBDD connected succesfully')
  } catch ( error ) {
      console.log( error )
      process.exit(1)
  }  
}

export default conectarDB
