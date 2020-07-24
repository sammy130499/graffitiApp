const mongoose=require('mongoose');
const jwt = require('jsonwebtoken')
let Schema=mongoose.Schema;




var adminSchema = new Schema({
    adminId:{
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
  });


  adminSchema.methods.generateAuthToken = async function() {
    let user=this;
   
    const token = jwt.sign({_id: user._id}, 'iNsertCooLName143',{expiresIn:"2h"})   
    user.tokens = user.tokens.concat({token}) 
    await user.save();
  
    return token;
}

adminSchema.statics.findByCredentials = async (adminId, password) => {
  const user = await User.findOne({adminId} )
  if (!user) {
    
      throw new Error({ error: 'Invalid login credentials' })
  }
  const isPasswordMatch = (password===user.password);
  
  if (!isPasswordMatch) {
    
      throw new Error({ error: 'Invalid login credentials' })
  }
  return user
}

const User=mongoose.model('admin',adminSchema,'admin');
module.exports=User;