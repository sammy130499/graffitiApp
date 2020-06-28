const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
const {
    v4
} = require('uuid')

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

const User=require('./models/User');
mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(res => console.log('connected'))
    .catch(e => console.log(e));



app.post('/api/updatePhoto',auth,(req,res)=>{
    let {tshirtUser,photo}=req.body;
    User.findOne({userId:tshirtUser}).then(ret=>{
        if(!ret){
            res.send({
                action:false,
                message:"invalid request"
            })
        }
        else{
            cloudinary.uploader.destroy(ret.imgPublicId).then(()=>{
                    cloudinary.uploader.upload(photo).then((ret1)=>{
                        let imgPublicId=ret1.public_id;
                        let photoUrl=ret1.secure_url;
                        ret.photoUrl=photoUrl;
                        ret.imgPublicId=imgPublicId;
                        User.findOneAndUpdate({userId:tshirtUser},ret).then(ret2=>{
                            req.user.usersAffected.push(tshirtUser);
                            User.findOneAndUpdate({userId:req.user.userId},req.user).then(()=>{
                                res.send({
                                    action:true,
                                    message:"successfully updated"
                                })
                            })
                        })
                    })
            }).catch(e=>{
                console.log(e);
            })
        }
    }).catch(e=>{
        console.log(e);
    })
})


app.post('/api/updatePhotoBack',auth,(req,res)=>{
    let {tshirtUser,photo}=req.body;
    User.findOne({userId:tshirtUser}).then(ret=>{
        if(!ret){
            res.send({
                action:false,
                message:"invalid request"
            })
        }
        else{
            cloudinary.uploader.destroy(ret.imgPublicId).then(()=>{
                    cloudinary.uploader.upload(photo).then((ret1)=>{
                        let imgPublicIdBack=ret1.public_id;
                        let photoUrlBack=ret1.secure_url;
                        ret.photoUrlBack=photoUrlBack;
                        ret.imgPublicIdBack=imgPublicIdBack;
                        User.findOneAndUpdate({userId:tshirtUser},ret).then(ret2=>{
                            req.user.usersAffected.push(tshirtUser);
                            User.findOneAndUpdate({userId:req.user.userId},req.user).then(()=>{
                                res.send({
                                    action:true,
                                    message:"successfully updated"
                                })
                            })
                        })
                    })
            }).catch(e=>{
                console.log(e);
            })
        }
    }).catch(e=>{
        console.log(e);
    })
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
                        let user=new User({userId,password,department,usersAffected:[],photoUrl,photoUrlBack,imgPublicId,imgPublicIdBack,firstName,lastName});
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
    res.send({
        action:true,
        message:req.user.photoUrl
    })
});

app.post('api/getImageUrlForUserBack',auth,(req,res)=>{
    res.send({
        action:true,
        message:req.user.photoUrlBack
    })
})

app.get('/api/getUsersAffected',auth,(req,res)=>{
    console.log(req.user.usersAffected);
    res.send({
        action:true,
        message:JSON.stringify(req.user.usersAffected)
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
    
})


app.listen(process.env.PORT, () => {
    console.log('listening at port 8000');
});