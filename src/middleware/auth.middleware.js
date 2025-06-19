
  import jwt from "jsonwebtoken";
  import User from "../models/User";

  const protectRoute = async(req, res, next) =>{
   try {
    // get token
    const token = req.header("Authorization").replace("Bearer ", "");
    if(!token) return res.status(401).json({message: "No authentification token, access denied " });
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //find user
     const user = await User.findById(decoded.userId).select("_password");
     if(!user) return res.status(401).json({message: "Token is not valid" });


     req.user= user;
     next();
   } catch (error) {
    console.error("AUthentification error", error.message );
    res.status(401).json({message:"Tken is not valid"});
   }
  };

  export default protectRoute
