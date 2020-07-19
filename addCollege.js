const mongoose = require('mongoose');
const College=require('./models/CollegeConfig');
mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(res => console.log('connected'))
    .catch(e => console.log(e));


// let departments=
let collegeConfig=[{
    college:"svnit-3rd-year",
    regex:'^u15(co||me||ce||ee||ec||ch)[0-2][0-9][0-9]$',
    departments:[
        {name:"Computer Engineering Department",code:"COED"},
    {name:"Chemical Engineering Department",code:"CHED"},
    {name:"Mechanical Engineering Department",code:"MED"},
    {name:"Electronics Engineering Department",code:"ECED"},
    {name:"Civil Engineering Department",code:"CED"},
    {name:"Electrical Engineering Department",code:"EED"},
    ]
},{
    college:"svnit-msc",
    regex:"^i15(ph||ma||cy)[0-2][0-9][0-9]$",
    departments:[
        {name:"MSc Physics",code:"MSP"},
        {name:"Msc Maths",code:"MSM"},
        {name:"Msc Chemistry",code:"MSCH"}]
}]




collegeConfig.forEach(col=>{
    let college=new College({
        college:col.college,
        admNumRegex:col.regex,
        departments:col.departments
    });
    college.save().then(res=>{
        console.log(res);
    })
})
