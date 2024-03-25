import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  phone_number: {
    type: String,
    unique: true, // Assuming phone number is unique for each user
  },
  tg_id: {
    type: String,
    unique: true, // Assuming phone number is unique for each user
  },
  email: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  gender: {
    type: String,
  },

  // followers: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'User', // Reference to the User model itself
  //   },
  // ],
});

export default mongoose.model('User', userSchema);
