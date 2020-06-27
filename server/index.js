const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const {
    v4
} = require('uuid')

const app = express();
const photo=require('./photo');

app.use(morgan('combined'));
app.use(bodyParser.json());
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
    let {userId,photoUrl}=req.body;
    User.findOne({userId}).then(ret=>{
        if(!ret){
            res.send({
                action:false,
                message:"user not present, create a user first"
            })
        }
        else{
            ret.oldPhotoUrl=ret.newPhotoUrl;
            ret.newPhotoUrl=photoUrl
            User.findOneAndUpdate({userId},ret).then(ret1=>{
                res.send({
                    action:true,
                    message:"user photo url updated successfully"
                })
            })
        }
    })

})

app.post('/api/createUser',async (req,res)=>{
    let {userId,password,department}=req.body;
    User.findOne({userId}).then(async ret=>{
        if(ret){
            res.send({
                action:false,
                message:"user already present"
            })
        }
        else{
            try{
                let user=new User({userId,password,department,usersAffected:[],newPhotoUrl:photo,oldPhotoUrl:photo});
                await user.save()
                let token=await user.generateAuthToken();
                res.send({
                    action:true,
                    message:{token,user}
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
        let user=await User.findByCredentials(userId,password);
    if (!user) {
        return res.status(401).send({message: 'Login failed! Check authentication credentials',action:false})
    }
    const token = await user.generateAuthToken();
    
    res.send({
        action:true,
        message:{token,user}
    })
    }
    catch(e){
        console.log(e);
        res.status(400).send({message:e,action:false});
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
    console.log("getdatafordashboardfunction");
    User.find({department}).then(ret=>{
        if(ret.length==0){
            console.log("inside if ");
            res.send({
                action:false,
                message:"nothing to show"
            })
        }
        else{
            console.log("inside else ");
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
        message:req.user.newPhotoUrl
    })
})


app.listen(process.env.PORT, () => {
    console.log('listening at port 8000');
});