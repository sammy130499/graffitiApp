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

//mongodb+srv://m001-student:mBVI3SbOLiX22EPT@avinash-001-q92dl.mongodb.net/graffiti?retryWrites=true&w=majority

var app = express();
var server = http.createServer(app);

app.use(morgan('combined'));
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

app.use(cors());

const auth=require('./adminAuth');
var distDir = __dirname + "/dist/graphClient";
app.use(express.static(distDir));


app.set('server', server);


const User=require('./models/admin');
const { findOne } = require('./models/admin');


//5LgBMVvJ2h1rs6gf  
mongoose.connect('mongodb+srv://sameer:5LgBMVvJ2h1rs6gf@cluster0.r6ar5.mongodb.net/admindetails?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(res => console.log('connected'))
    .catch(e => console.log(e));


    app.post('/api/createUseradmin', (req,res)=>{
        let {adminId,password}=req.body;
        console.log(adminId);
        console.log("workingggg");
        User.findOne({adminId}).then(async ret=>{
            console.log(adminId);
                
                if(ret){
                    console.log(11111111);
                res.send({
                    action:false,
                    message:"user already present"
                })
            }
            else{
                
                try{    
                    console.log(2222222);      
                      let user=new User({adminId,password});
                        console.log(adminId);
                            await user.save()
                            // let token=await user.generateAuthToken();

                            // res.send({
                            // action:true,
                            // message:{token,user}
                            // })              
                    
                }
                catch(e){
                    console.log(3333333333);
                    res.status(400).send({
                        action:true,
                        message:e
                    })
                }
                
            }
        })
    });

    app.post('/api/login',async (req,res)=>{
        let {adminId,password}=req.body;
        try{
            console.log(adminId,password);
            let user=await User.findByCredentials(adminId,password);
            
        if (typeof user === "Error")
        {
            return res.status(401).send({message: 'Login failed! Check authentication credentials',action:false})
        }
        console.log(user,"helloworld");
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
            console.log(JSON.stringify(req.user.tokens));                    
            
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
    



    app.get('*', (req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));    
    });
    
    
    app.get('server').listen(3000, () => {
        console.log('listening at port 3000');
    });