const mongoose = require('mongoose');
const User=require('./models/User');
mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(res => console.log('connected'))
    .catch(e => console.log(e));

let user=new User({userId:"showcase",password:"5e8428fc14e3255937e0b4e5b46313eaadd21be8ef4ea756b0753d4715d326ec",deparment:"COEDS",tokens:[],firstName:"showcase",lastName:"profile",photoUrl:"https://res.cloudinary.com/dvxx5f4hr/image/upload/v1593808997/graffitee_nsj4nl.jpg",photoUrlBack:"https://res.cloudinary.com/dvxx5f4hr/image/upload/v1593808997/graffitee_nsj4nl.jpg"});
user.save().then(res=>{
    console.log(res);
})