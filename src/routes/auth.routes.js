
import  express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const generateToken = (userId) =>{
 return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "15d"})
}


router.post("/register", async (req, res) =>{
try{
   const {email, username, password} = req.body;
   if(!username || !email || !password){
    return res.status(400).json({message: "All fields are required"});
   }

    if (password.length < 6){
 return res.status(400).json({message:"Password should be at least 6 characters long"});
    }
    if(username.length<3){
     return res.status(400).json({message:"Username should be at least 3 characters long"});
    }

    // Check if user already exists
  // const existingUser = await User.findOne({$or:[{email},{username}]});
   // if (existingUser){
  //   return res.status(400).json({message:"User already exists"});
   // }
   const existingEmail =  await User.findOne({email});
   if (existingEmail){
       return res.status(400).json({message:"User already exists"});
   }
   const existingUsername =  await User.findOne({username});
   if (existingUsername){
       return res.status(400).json({message:"Username already exists"});
   }
   //Get random avantar

    const profileImage = `https://api.dicebear.com/5.x/initials/svg?seed=${username}`;
   const user = new User ({
    email,
    username,
    password,
    profileImage: "",
   })

   await user.save();
   //generate token
   const token = generateToken(user._id);

   res.status(201).json({
    token,
    user:{
     _id: user._id,
     username: user.username,
     email: user.email,
     profileImage: user.profileImage,
    },
   });

} catch(error){
    console.log("Error in register route");
    res.status(500).json({message:"Internal server error"}) 
     

}
});

router.post("/login", async (req, res) =>{
  try {
 const { email, password } = req.body;

 if(!email || password) return res.status(400).json({message:"All fields are requiered" });
   const user =await User.findOne({email});
   if(!user){
    res.status(400).json({message: "User does not exist"});
   
   }
   // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"});

   
const token = generateToken(user._id);

   res.status(201).json({
    token,
    user:{
     _id: user._id,
     username: user.username,
     email: user.email,
     profileImage: user.profileImage,
    },
   });



  } catch(error){

   console.log("Error in login route", error);
    res.status(500).json({message:"Internal server error"})
  }
  
});

export default router;