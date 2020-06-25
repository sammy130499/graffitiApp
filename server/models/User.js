const mongoose=require('mongoose');

let Schema=mongoose.Schema;

var userSchema = new Schema({
    userId:String,
    password:String,
    usersAffected:[String],
    prevPhotoUrl:String,
    newPhotoUrl:String,
    department:String
  });

module.exports=mongoose.model('user',userSchema,'USER');