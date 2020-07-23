const mongoose = require('mongoose');
const User=require('./models/User');
mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(res => findUser())
    .catch(e => console.log(e));

let findUser=async ()=>{
    let user=await User.findOne({userId:"u16co025"});
    user.photoUrl=user.OldPhotoUrl
    user.imgPublicId=user.OldPublicId
    await User.findOneAndUpdate({userId:"u16co025"},user)
} 

