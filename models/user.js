const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        return /https?:\/\/.+/.test(link);
      },
      message: (err) => `the URL '${err.value}' is invalid`,
    },
  },
},
{
  versionKey: false,
});

module.exports = mongoose.model('user', userSchema);
