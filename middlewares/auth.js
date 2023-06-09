// auth, isStudent, isUser

const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.auth = (req, res, next) =>{
    try{
        console.log("From cookie",req.cookies.token)
        console.log("From body", req.body.token)
        // console.log("From header",req.header("Authourization").replace("Bearer ",""))

        //extract jwt token
        const token = req.body.token || req.cookies.token || req.header("Authourization").replace("Bearer ","");
        if(!token){
            return res.status(400).json({
                success:false,
                message: "Token Missing"
            })
        }

        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decode)
            req.user = decode;
        } catch(error) {
            return res.status(401).json({
                success:false,
                message:'token is invalid'
            })
        }
        next()

    } catch(error){
        return res.status(401).json({
            success: false,
            message: 'Something went wrong, while verifying the token'
        })
    }
}



exports.isStudent = (req, res, next) =>{
    try{
        if(req.user.role !== 'Student'){
            return res.status(401).json({
                success: true,
                message: "This is a protected route for students only"
            })
        } 
        next()
    } catch(error) {
        return res.status(500).json({
            success:false
        })
    }
}

exports.isAdmin = (req, res, next) =>{
    try{
        if(req.user.role !== 'Admin'){
            return res.status(401).json({
                success: true,
                message: "This is a protect route for admin only"
            })
        } 
        next()
    } catch(error) {
        return res.status(500).json({
            success:false
        })
    }
}