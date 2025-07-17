// models/Bookmark.js
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
  summary: {
    type: [String], // This MUST be an array of Strings: [String]
    required: true,
  },
  faviconUrl: {
    type: String,
  },
  tags: {
    type: [String],
    default: [], // Default to an empty array
  },
  // --- NEW: Add position field for ordering ---
  position: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);