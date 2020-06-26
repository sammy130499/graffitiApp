const mongoose=require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')
let Schema=mongoose.Schema;

var userSchema = new Schema({
    userId:{
      type:String,
      required:true,
      trim:true
    },
    password:{
      type:String,
      required:true
    },
    tokens: [{
      token: {
          type: String,
          required: true
      }
    }],
    usersAffected:[String],
    newPhotoUrl:String,
    oldPhotoUrl:String,
    department:String
  });


  userSchema.methods.generateAuthToken = async function() {
    let user=this;
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY,{expiresIn:"2h"})
    user.tokens = user.tokens.concat({token})
    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async (userId, password) => {
  // Search for a user by email and password.

  const user = await User.findOne({userId} )
  if (!user) {
      throw new Error({ error: 'Invalid login credentials' })
  }
  const isPasswordMatch = (password===user.password);
  if (!isPasswordMatch) {
      throw new Error({ error: 'Invalid login credentials' })
  }
  return user
}

const User=mongoose.model('user',userSchema,'USER');
module.exports=User;