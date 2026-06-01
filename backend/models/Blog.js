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

   likes:{
    type:Number,
    default:0
  },
  
  comments: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    content: String
  }
]

},
{
  timestamps: true
}
);

module.exports = mongoose.model("Blog", blogSchema);