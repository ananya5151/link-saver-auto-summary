import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  favicon: {
    type: String,
  },
  summary: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);