const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const {Mutex}=require('await-semaphore');
const path=require('path');
let mutex=new Mutex();
const{v4}=require('uuid');
const http=require('http');
const socketio = require('socket.io');
cloudinary.config({ 
    cloud_name: 'dvxx5f4hr', 
    api_key: '233683522225317', 
    api_secret: 'RxNhjMPi7_OUTbfFlZM_oFzqFRg' 
  });

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

const photo=require('./photo');
const photo_back=require('./photo_back');

app.use(morgan('combined'));
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

app.use(cors());

const auth=require('./auth');
var distDir = __dirname + "/dist/graphClient";
app.use(express.static(distDir));

app.set('socketio',io);
app.set('server', server);
let numClients = {};
let clients={}

const User=require('./models/User');
const { findOne } = require('./models/User');
const CollegeConfig=require("./models/CollegeConfig");
mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(res => console.log('connected'))
    .catch(e => console.log(e));

io.on("connection", socket => {
        console.log("user connected");
      
        
        socket.on('ack',({room,user})=>{
            socket.join(room,()=>{
                socket.room=room;
                socket.thisUser=user;
                if (numClients[room] === undefined) {
                    numClients[room] = 1;
                    clients[room]=[];
                    clients[room].push(user);
                } else if(numClients[room] === 0) {
                    numClients[room] = 1;
                    clients[room]=[];
                    clients[room].push(user);
                }
                else if(numClients[room]<0){
                    numClients[room] = 1;
                    clients[room]=[];
                    clients[room].push(user);
                }
                else{
                    numClients[room]++;
                    if(!clients[room].includes(user))
                    clients[room].push(user);
                }
                socket.on('disconnect',()=>{
                    numClients[socket.room]--;
                    if(clients[socket.room])
                    clients[socket.room]=clients[socket.room].filter(val=>val!=socket.thisUser)
                })
                io.in(room).emit('ackback',{num:numClients[room],present:clients[room][0]});

            })
        })
    
    });

app.post('/api/updatePhoto',auth,async (req,res)=>{
    let {tshirtUser,photo}=req.body;
        let release= await mutex.acquire();
        let ret=await User.findOne({userId:tshirtUser});
        if(!ret){
            release();
            res.send({
                action:false,
                message:"invalid request"
            })
        }
        else{
            await cloudinary.uploader.destroy(ret.publicId);
            let ret1=await cloudinary.uploader.upload(photo);
            let publicId=ret1.public_id;
            let photoUrl=ret1.secure_url;
            ret.oldPhotoUrl=ret.photoUrl;
            ret.oldPublicId=ret.publicId
            ret.photoUrl=photoUrl;
            ret.publicId=publicId;
            ret.writingUsers.push(req.user.userId);
            let ret2=await User.findOneAndUpdate({userId:tshirtUser},ret);
            req.user.usersAffected.push(tshirtUser);
            await User.findOneAndUpdate({userId:req.user.userId},req.user);
            release();
            res.send({
                action:true,
                message:"successfully updated"
            })
        }
    
});

app.post('/api/getCollegeConfig',(req,res)=>{
    let {college}=req.body;
    console.log(college);
    CollegeConfig.findOne({college}).then(ret=>{
        if(!ret){
            res.send({
                action:false,
                message:'invalid college'
            })
        }
        else{
            res.send({
                action:true,
                message:JSON.stringify(ret)
            })
        }
    })
})


app.post('/api/updatePhotoBack',auth,async (req,res)=>{
    let {tshirtUser,photo}=req.body;
    let release= await mutex.acquire();
        let ret=await User.findOne({userId:tshirtUser});
        if(!ret){
            release();
            res.send({
                action:false,
                message:"invalid request"
            })
        }
        else{
            await cloudinary.uploader.destroy(ret.publicIdBack);
            let ret1=await cloudinary.uploader.upload(photo);
            let publicId=ret1.public_id;
            let photoUrl=ret1.secure_url;
            ret.oldPhotoUrlBack=ret.photoUrlBack;
            ret.oldPublicIdBack=ret.publicIdBack;
            ret.photoUrlBack=photoUrl;
            ret.publicIdBack=publicId;
            ret.writingUsers.push(req.user.userId);
            let ret2=await User.findOneAndUpdate({userId:tshirtUser},ret);
            req.user.usersAffected.push(tshirtUser);
            await User.findOneAndUpdate({userId:req.user.userId},req.user);
            release();
            res.send({
                action:true,
                message:"successfully updated"
            })
        }
    })


app.post('/api/createUser',async (req,res)=>{
    let {userId,password,department,firstName,lastName,college}=req.body;
    User.findOne({userId}).then(async ret=>{
        if(ret){
            res.send({
                action:false,
                message:"user already present"
            })
        }
        else{
            let photoUrl;
            let publicId;
            let photoUrlBack;
            let publicIdBack;
            try{
                cloudinary.uploader.upload(photo).then(async ret1=>{
                    photoUrl=ret1.secure_url;
                    publicId=ret1.public_id;
                    cloudinary.uploader.upload(photo_back).then(async ret2=>{
                        photoUrlBack=ret2.secure_url;
                        publicIdBack=ret2.public_id; 
                        console.log("photo url ");
                        let user=new User({userId,password,department,usersAffected:[],photoUrl,photoUrlBack,publicId,publicIdBack,firstName,lastName,writingUsers:[],room:v4(),oldPhotoUrl:"",oldPublicId:"",oldPhotoUrlBack:"",oldPublicIdBack:"",college});
                        await user.save()
                        let token=await user.generateAuthToken();
                        res.send({
                        action:true,
                        message:{token,user}
                        })
                        
                    }).catch(e=>{
                        console.log(e);
                    })
                    

                }).catch(e=>{
                    console.log(e);
                })
               
                
            }
            catch(e){
                res.status(400).send({
                    action:true,
                    message:e
                })
            }
            
        }
    })
});



app.post('/api/login',async (req,res)=>{
    let {userId,password}=req.body;
    try{
        console.log(userId,password);
        let user=await User.findByCredentials(userId,password);
        
    if (typeof user === "Error")
    {
        return res.status(401).send({message: 'Login failed! Check authentication credentials',action:false})
    }
    const token = await user.generateAuthToken();
    console.log(req.headers());
    res.send({
        action:true,
        message:{token,user}
        
    })
   
    }
    catch(e){
        res.send({message:"wrong credentials",action:false});
    }
});




app.get('/api/logout',auth,async (req,res)=>{
    try {
        console.log(1);
        console.log(JSON.stringify(req.user.tokens));
        console.log(2);
        
        req.user.tokens = req.user.tokens.filter((token) => {
            console.log(3);
            return token.token != req.token           

        })
        console.log(4);
        await req.user.save()
        console.log(5);
        res.send({
        
            action:true,
            message:"user logged out"
        })
    } catch (error) {
        res.status(500).send({
            action:false,
            message:error
        })
    }
    console.log(6);
});




app.post('/api/checkUser',(req,res)=>{
    let {userId}=req.body;
    console.log({userId});
    User.findOne({userId}).then(ret=>{
        if(ret){
            res.send({
                action:false,
                message:"user already present"
            })
        }
        else{
            res.send({
                action:true,
                message:"user can be added"
            })
        }
    })
});

app.post('/api/getDataForDashboard',auth,(req,res)=>{
    let {department}=req.body;
    User.find({department}).then(ret=>{
        if(ret.length==0){
            res.send({
                action:false,
                message:"nothing to show"
            })
        }
        else{
            res.send({
                action:true,
                message:JSON.stringify(ret)
            })
        }
    })
})


app.post('/api/getImageUrlForUser',auth,(req,res)=>{
    let {face}=req.body;
    if(face=="front"){
        res.send({
            action:true,
            message:req.user.photoUrl
        })
    }
    else{
        res.send({
            action:true,
            message:req.user.photoUrlBack
        })
    }
    
});

app.post('/api/getImageUrlForUserBack',auth,(req,res)=>{
    res.send({
        action:true,
        message:req.user.photoUrlBack
    })
})

app.get('/api/getWritingUsers',auth,(req,res)=>{
    res.send({
        action:true,
        message:req.user.writingUsers
    })
})

app.post('/api/getUsersAffectedAndRoom',auth,(req,res)=>{
    let {tshirtUser}=req.body;
    User.findOne({userId:tshirtUser}).then((ret)=>{
        if(!ret){
            res.send({
                action:false,
                message:"user invalid"
            })
        }
        else{
            res.send({
                action:true,
                message:{arr:JSON.stringify(req.user.usersAffected),room:ret.room}
            })
        }
    })
    
});

app.post('/api/getImageUrlForTshirtUser',auth,(req,res)=>{
    let {userId}=req.body;
    User.findOne({userId}).then(ret=>{
        if(!ret){
            res.send({
                action:false,
                message:"invalid user request"
            })
        }
        else{
            res.send({
                action:true,
                message:{url:ret.photoUrl,user:JSON.stringify(req.user)}
            })
        }
    }).catch(e=>{
        console.log(e);
    })
    
})
app.post('/api/getImageUrlForTshirtUserBack',auth,(req,res)=>{
    let {userId}=req.body;
    User.findOne({userId}).then(ret=>{
        if(!ret){
            res.send({
                action:false,
                message:"invalid user request"
            })
        }
        else{
            res.send({
                action:true,
                message:{url:ret.photoUrlBack,user:JSON.stringify(req.user)}
            })
        }
    }).catch(e=>{
        console.log(e);
    })
    
});


app.put('/api/updateUsername/',auth,(req,res)=>{

    User.updateOne({userId:req.body.userId},{userId:req.body.userIdNew}).then(ret=>{
        if(!ret){
            res.send({
                action:false,
                message:"invalid user request"
            })
        }
        else{
            res.send({
                action:true,
                message:"username updated!",
            })
        }


    })

});



app.delete('/api/deleteUserFromAdmin/:id',(req,res)=>{
    // console.log("this is the userid ",req.body);
    let {userId}=req.params.id;
    User.findOneAndDelete({"userId":req.params.id}).then(ret=>{
        if(!ret)
        {   
            res.send({
                action:false,
                message:"invalid user request"
            })
        }
        else{
            res.send({
                action:true,
                message:"Account successfully deleted!",
            })
            console.log("successfully deleted");
        }

    })
})

app.get('/api/logoutall', (req,res)=>{
        User.find({}).then(ret=>{
            console.log(ret);
            if(!ret)
            {
                
            }
            else{
                ret.forEach(user=>{
                    user.tokens=[];
                    user.save()
                   
                })
                res.send({
                    action:true,
                    message:"everyone logged out",
                })
            }
    
        })
    
    });

     app.put('/api/updateUserpass/' ,(req,res)=>{
        let {userPass}=req.body.password;
        console.log("servercheck",req.body.password);
        User.updateOne({"userId":req.body.userId},{"password":req.body.password}).then(ret=>{
            if(!ret){
                res.send({
                    action:false,
                    message:"invalid user request"
                })
            }
            else{
                res.send({
                    action:true,
                    message:"password updated !",
                })
            }
    
    
        })
    
    });




app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));    
});


app.get('server').listen(process.env.PORT, () => {
    console.log('listening at port 8000');
});