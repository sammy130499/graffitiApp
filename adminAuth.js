const jwt = require('jsonwebtoken')
const User = require('./models/admin');


const auth = async(req, res, next) => {
    const demo = req.header('Authorization');
    console.log(req);
    console.log(JSON.stringify(req),"heyyyyeee");
    const token = req.header('Authorization').replace('Bearer ', '')
    let data;
    try{     
    data = jwt.verify(token, 'iNsertCooLName143');
    }
    catch(e){
        res.status(401).send({ error: 'Not authorized to access this resource. token expired' }) 
    }
    try {
        const user = await User.findOne({ _id: data._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}
module.exports = auth