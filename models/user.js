'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String
    // required: [true, "Title can't be empty"]
  },
  password: {
    type: String
    // required: [true, "Title can't be empty"]
  },
  name: {
    type: String
    // required: [true, "Title can't be empty"]
  },
  email: {
    type: String
    // required: [true, "Title can't be empty"]
  },
  photo: {
    pic_path: String,
    pic_name: String
    // required: [true, "Content can't be empty"]
  }

  // @todo add posts,photos-id
  // @todo add markers
  // @todo add profile picture
  // @todo add groups
  // @todo favorites

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User
};
