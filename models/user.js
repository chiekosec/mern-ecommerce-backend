const mongoose = require("mongoose");
const { v1: uuidv1 } = require("uuid");
const crypto = require('crypto');

const { Schema } = mongoose;
const userSchema = new Schema({
  name: {
    type: String,
    maxlength: 32,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    maxlength: 32,
    trim: true
  },
  userinfo: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  encrypted_password: {
    type: String,
    required: true

  },
  salt: String,
  role: {
    type: Number,
    default: 0
  },
  purchases: {
    type: Array,
    default: []
  }

}, {timestamps: true});

userSchema.virtual("password")
  .set(function(password){
    this._password = password
    this.salt = uuidv1()
    this.encrypted_password = this.setPassword(password)
  })
  .get(function(){
    return this._password
  })

userSchema.methods.authenticate = function(password) {
  return this.encrypted_password === this.setPassword(password)
}

userSchema.methods.setPassword = function(password) {
  if(!password) return "";
  try {
    return crypto.createHmac('sha256', this.salt)
                   .update(password)
                   .digest('hex');
  } catch(e) {
      return "";
  }
}

module.exports = mongoose.model("User", userSchema);