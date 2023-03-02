const router = require('express').Router();
const User = require('../models/User');
const CryptoJs = require('crypt-js');
const jwt = require('jsonwebtoken')


//USER REGISTRATION ROUTE
router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
        
    })
    try {
        const savedUser = await newUser.save()
        res.sendStatus(201).json(savedUser)
    } catch (error) {
        res.status(500).json(error.message)
    }
})


//USER LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user){
            return res.status(401).json('Invalid username or password')
        }
        const hasedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hasedPassword.toString(CryptoJs.enc.utf8)
        originalPassword !== req.body.password && 
            res.status(401).json('Invalid username or password');

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SEC, {expiresIn: '3d'})

    const  { password, ...others } = user_doc;
        res.status(200).json({...others, accessToken})
    } catch (error) {
        res.status(500).json(error.message)
    }
})

module.exports = router
