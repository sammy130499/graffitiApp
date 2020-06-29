



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

cloudinary.config({ 
    cloud_name: 'dvxx5f4hr', 
    api_key: '233683522225317', 
    api_secret: 'RxNhjMPi7_OUTbfFlZM_oFzqFRg' 
  });

const app = express();
const photo=require('./photo');
const photo_back=require('./photo_back');
app.use(morgan('combined'));
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cors());
const auth=require('./auth');
var distDir = __dirname + "/dist/graphClient";
app.use(express.static(distDir));

const User=require('./models/User');
mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(res => console.log('connected'))
    .catch(e => console.log(e));



app.post('/api/updatePhoto',auth,async (req,res)=>{
    let {tshirtUser,photo}=req.body;
        console.log('here1')
        let release= await mutex.acquire();
        console.log('here2')
        let ret=await User.findOne({userId:tshirtUser});
        console.log('here3')
        if(!ret){
            release();
            res.send({
                action:false,
                message:"invalid request"
            })
        }
        else{
            console.log('here4')
            await cloudinary.uploader.destroy(ret.imgPublicId);
            console.log('here5')
            let ret1=await cloudinary.uploader.upload(photo);
            console.log('here6')
            let imgPublicId=ret1.public_id;
            let photoUrl=ret1.secure_url;
            ret.photoUrl=photoUrl;
            ret.imgPublicId=imgPublicId;
            ret.writingUsers.push(req.user.userId);
            let ret2=await User.findOneAndUpdate({userId:tshirtUser},ret);
            req.user.usersAffected.push(tshirtUser);
            console.log('here7')
            await User.findOneAndUpdate({userId:req.user.userId},req.user);
            console.log('here8')            
            release();
            console.log('here9')            
            res.send({
                action:true,
                message:"successfully updated"
            })
        }
    
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
            await cloudinary.uploader.destroy(ret.imgPublicIdBack);
            let ret1=await cloudinary.uploader.upload(photo);
            let imgPublicId=ret1.public_id;
            let photoUrl=ret1.secure_url;
            ret.photoUrlBack=photoUrl;
            ret.imgPublicIdBack=imgPublicId;
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
    let {userId,password,department,firstName,lastName}=req.body;
    User.findOne({userId}).then(async ret=>{
        if(ret){
            res.send({
                action:false,
                message:"user already present"
            })
        }
        else{
            let photoUrl;
            let imgPublicId;
            let photoUrlBack;
            let imgPublicIdBack;
            try{
                cloudinary.uploader.upload(photo).then(async ret1=>{
                    photoUrl=ret1.secure_url;
                    imgPublicId=ret1.public_id;
                    cloudinary.uploader.upload(photo_back).then(async ret2=>{
                        photoUrlBack=ret2.secure_url;
                        imgPublicIdBack=ret2.public_id; 
                        console.log("photo url ");
                        let user=new User({userId,password,department,usersAffected:[],photoUrl,photoUrlBack,imgPublicId,imgPublicIdBack,firstName,lastName,writingUsers:[],room:v4()});
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
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
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
});



app.post('/api/checkUser',(req,res)=>{
    let {userId}=req.body;
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

app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));    
});


app.listen(process.env.PORT, () => {
    console.log('listening at port 8000');
});