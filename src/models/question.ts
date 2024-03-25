import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  ar_br: {
    type: String,
    enum: ['ar', 'br'],
    required: true,
  },
  bi_di: {
    type: String,
    enum: ['bi', 'di'],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  woreda: {
    type: String,
    required: true,
  },
  last_digit: {
    type: String,
    required: true,
  },
  description: String,
  photo: {
    type: Array,
    required: true,
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'pending',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
