const jwt = require('jsonwebtoken')
const User = require('./models/User')

const auth = async(req, res, next) => {
    console.log(7);
    console.log(req.header('Authorization'));
    const token = req.header('Authorization').replace('Bearer ', '')
    let data;
    try{
        console.log(8);
    data = jwt.verify(token, process.env.JWT_KEY);
    }
    catch(e){
        res.status(401).send({ error: 'Not authorized to access this resource. token expired' }) 
    }
    try {
        console.log(9);
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
    console.log(10);
}
module.exports = auth