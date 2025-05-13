
import mongoose from 'mongoose';

const historySchema =  new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  input: { type: String, required: true },
  output: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('History', historySchema);
