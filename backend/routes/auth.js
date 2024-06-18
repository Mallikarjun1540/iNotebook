const express=require('express');
const router=express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET='arjun@123';

// Route 1: Create user using Post "/api/auth/createuser" dose not require auth
router.post('/createuser',[
    body('name',"Enter a Valid Name").isLength({min:3}),
    body('email',"Enter a Valid Email").isEmail(),
    body('password',"Password must be min 5 char").isLength({min:5})
    
] ,async(req,res)=>{
    let success=false;
    // if there are errors return bad request and Errors
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors:errors.array()});
    }
    // check weather the user with this email exits already
    try {
    let user="";
     user=await User.findOne({email:req.body.email});
    if(user)
    {
        return res.status(400).json({success,error:"sorry a user with this email already exits"})
    }
    const salt=await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt)
    // create new user
     user=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:secPass   
    })

    // sending the response to tool #Thuder client
    const data={
        user:{
            id:user.id
        }
    }
    const authtoken=jwt.sign(data,JWT_SECRET);
    // console.log(jwtData);
    success=true;
    res.json({success,authtoken});
    // res.json(user);
    
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send("internal server error");
    }
    
})

//Route 2:  Authenticate a user using Post "/api/auth/login" dose not require auth
router.post('/login',[
    body('email',"Enter a Valid Email").isEmail(),
    body('password',"Password can not be blank").exists()
    
] ,async(req,res)=>{
    let success=false;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password}=req.body;
try {
    let user=await User.findOne({email});
    if(!user){
        success=false;
        return res.status(400).json({success,error:"please try to login with correct login credentials"})
    }
    const passwrdcompare=await bcrypt.compare(password,user.password);
    if(!passwrdcompare){
        success=false;
        return res.status(400).json({success,error:"please try to login with correct login credentials"})

    }
    const data={
        user:{
            id:user.id
        }
    }
    const authtoken=jwt.sign(data,JWT_SECRET);
    success=true;
    res.json({success, authtoken});

} catch (error) {
    console.log(error.message)
    res.status(500).send("Internal server error");
}
})


//Route 3: Get logged in user Details using Post "/api/auth/getuser" Login required
router.post('/getuser',fetchuser ,async(req,res)=>{
try {
    userid=req.user.id;
    const user= await User.findById(userid).select("-password");
    res.send(user)
}catch (error) {
    console.log(error.message)
    res.status(500).send("Internal server error");
}})
module.exports=router