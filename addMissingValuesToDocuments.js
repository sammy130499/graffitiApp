const mongoose = require('mongoose');
const User=require('./models/User');
mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(res => findUser())
    .catch(e => console.log(e));



let findUser=async ()=>{
    let users=await User.find();
    users.forEach(async user=>{
        // user.college="svnit-btech-msc"
        // user.oldPhotoUrl=user.photoUrl;
        // user.oldPublicId=user.imgPublicId;
        // user.oldPhotoUrlBack=user.photoUrlBack;
        // user.oldPublicIdBack=user.imgPublicIdBack;
        // let res=await User.findOneAndUpdate({userId:user.userId},user);
        console.log(user);
    })
} 

