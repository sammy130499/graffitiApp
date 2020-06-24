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


app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const User=require('./models/User');
mongoose.connect('mongodb+srv://m001-student:mBVI3SbOLiX22EPT@avinash-001-q92dl.mongodb.net/graffiti?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(res => console.log('connected'))
    .catch(e => console.log(e));



app.post('/updatePhoto',(req,res)=>{
    let {userId,photoUrl}=req.body;
    User.findOne({userId}).then(ret=>{
        if(!ret){
            res.send({
                action:false,
                message:"user not present, create a user first"
            })
        }
        else{
            ret.photoUrl=photoUrl;
            User.findOneAndUpdate({userId},ret).then(ret1=>{
                res.send({
                    action:true,
                    message:"user photo url updated successfully"
                })
            })
        }
    })

})

app.post('/createUser',(req,res)=>{
    let {userId,password}=req.body;
    User.findOne({userId}).then(ret=>{
        if(ret){
            res.send({
                action:false,
                message:"user already present"
            })
        }
        else{
            let user=new User({userId,password});
            user.save().then(ret1=>{
                res.send({
                    action:true,
                    message:"user created"
                })
            })
        }
    })
})

app.post('/checkUser',(req,res)=>{
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

app.get('/getDataForDashboard',(req,res)=>{
    User.find().then(ret=>{
        if(ret.length==0){
            res.send({
                action:false,
                message:"nothing to show"
            })
        }
        else{
            res.send({
                action:true,
                message:ret
            })
        }
    })
})


app.listen(8000, () => {
    console.log('listening at port 8000');
});