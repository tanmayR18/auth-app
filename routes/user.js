const express = require('express')
const router = express.Router()
const User = require('../model/User')

const { login, signup} = require('../controllers/auth')
const { auth, isStudent, isAdmin } = require('../middlewares/auth')

router.post('/login',login)
router.post('/signup',signup)

//Testing route
router.get('/test', auth, (req, res) => {
    res.json({
        success:true,
        message: 'Welcome to protected route for test'
    })
})

//Protected route

router.get('/admin',auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Protected route for Admin"
    })
})

router.get('/student',auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Protected route for Student"
    })
})

// use of req.user = token     which is written in middlerware

router.get('/getEmail', auth, async(req, res) => {
    try{

        const id = req.user.id
        console.log(id)
        const user = await User.findOne({_id:id})
        console.log(user)

        res.status(200).json({
            sucess: true,
            user: user,
            messagae: "Welcome to the email route"
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            messagae: "Error while fetching the user data by user id",
            error: err
        })
    }

})


module.exports = router;