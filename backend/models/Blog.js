const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  category: {
    type: String
  },

  status: {
    type: String,
    enum: ["draft", "pending", "published","approved", "rejected"],
    default: "draft"
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  likes: {
    type: Number,
    default: 0
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model("Blog", blogSchema);