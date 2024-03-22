import mongoose from 'mongoose';
import { string } from 'zod';

type Status = 'review' | 'pending' | 'posted' | 'cancelled';

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  section: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },

  ar_br_type: {
    type: String,
    unique: true, // Assuming phone number is unique for each user
  },
  bi_di_type: {
    type: String, // Assuming phone number is unique for each user
  },
  location: {
    type: String,
  },
  description: {
    type: Number,
    required: true,
  },
  last_digit: {
    type: String,
  },
  photoLinks: [{ link: string }],
  status: {
    type: String,
  },
  notify_setting: {
    type: String,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model itself
    },
  ],
});

export default mongoose.model('Question', questionSchema);
