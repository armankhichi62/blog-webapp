const User=require("../models/User");
const bcrypt=require("bcrypt");

exports.register=async(req,res)=>{
try{

const {name,email,password,role}=req.body;

const userExists=await User.findOne({email});

if(userExists){
 return res.status(400).json({
    message:"User already exists"
 });
}

const hashedPassword=await bcrypt.hash(password,10);

const user=await User.create({
   name,
   email,
   password:hashedPassword,
   role
});

res.status(201).json({
 message:"User Registered Successfully"
});

}
catch(error){
res.status(500).json(error.message);
}
}
const jwt = require("jsonwebtoken");

exports.login = async(req,res)=>{
try{

const {email,password}=req.body;

const user=await User.findOne({email});

if(!user){
return res.status(404).json({
message:"User not found"
});
}

const match=await bcrypt.compare(
password,
user.password
);

if(!match){

return res.status(400).json({
message:"Invalid credentials"
});
}

const token=jwt.sign(
{
id:user._id,
role:user.role
},
process.env.JWT_SECRET,
{
expiresIn:"7d"
}
);

res.json({

message:"Login Successful",

token,

user:{
id:user._id,
name:user.name,
email:user.email,
role:user.role
}

});

}

catch(error){

res.status(500).json(
error.message
);

}

}