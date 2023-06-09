const bcrypt = require('bcrypt');
const User = require('../model/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//sign up route handler

exports.signup = async(req, res) => {
    try{
        //get data 
        const { name, email, password, role } = req.body

        //check if user already exit
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({
                sucess:false,
                message: "User alreadu exists"
            })
        }

        //secure password 
        let hashPassword;
        try{
            hashPassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({
                sucess:false,
                message:"Error in hashing password"
            })
        }

        //create entry for User
        const user = await User.create({
            name, email, password:hashPassword, role
        })

        return res.status(200).json({
            sucess:true,
            message:"Entry created successfully"
        })
    }
    catch(err){
        console.log('Erroe while regestering user')
        console.error(err)
        return res.status(500).json({
            sucess:false,
            message:'Error in creating entry for the user'
        })
    }
}



//login 

exports.login = async(req, res) => {
    try{
        //data fetch
        const { email, password } = req.body

        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                sucess:false,
                message: 'Please fill all the details successfully'
            })
        }

        //check for registered user
        let user = await User.findOne({email})
        //if not a registered user
        if(!user){
            return res.status(400).json({
                sucess:false,
                message:"User is not registered"
            })
        }

        //verify password and generate a JWT tokem
        const payload = {
            email:user.email,
            id:user._id,
            role:user.role
        }

        if(await bcrypt.compare(password,user.password)){
            //password matched
            let token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h"
                }
            )

            user = user.toObject()

            user.token = token;
            //to hide password from hacker
            user.password = undefined

            //cookies
            const options = {
                expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token",token,options).status(200).json({
                sucess:true,
                token,
                user,
                message:'User Logged in successfully'
            })

        }
        else{
            //password do not matched
            res.status(403).json({
                sucess:false,
                message:"Password incorrect"
            })
        }
    }
    catch(err){
        res.status(403).json({
            sucess:false,
            message:"Password incorrect"
        })
    }
}