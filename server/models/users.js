import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let users = new Schema({
  email:String,
  password:String,
  name:{
      type:String,
      default:'Hola'
  }
})

export default mongoose.model('users',users)