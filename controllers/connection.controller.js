import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
   
export default mongoose.connection;