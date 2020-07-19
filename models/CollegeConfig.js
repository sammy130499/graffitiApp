const mongoose=require('mongoose');
let Schema=mongoose.Schema;

var CollegeSchema = new Schema({
    college:String,
    admNumRegex:String,
    departments:[
        {
            name:String,
            code:String
        }
    ]
  });

const college=mongoose.model('collegeConfig',CollegeSchema,'collegeConfig');
module.exports=college;