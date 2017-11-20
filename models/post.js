'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({

  title: {
    type: String,
    required: [true, "Title can't be empty"]
  },
  content: {
    type: String,
    required: [true, "Content can't be empty"]
  },

  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  user_name: String
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Post = mongoose.model('Post', postSchema);
module.exports = {
  Post
};
