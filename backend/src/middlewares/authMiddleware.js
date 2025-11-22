import {promisify} from "node:util";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protect = async (req, res ,next) => {
  try {

    // Step 1 getting token and check if it is there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      token = req.headers.authorization.split(" ")[1];
    }else if(req.cookies.jwt && req.cookies.jwt !== "loggedout"){
      token = req.cookies.jwt;
    }

    if(!token){
      throw new Error("You are not Logged in! Please Login to access");
    }

    //Step 2: Verification of token -> decoded code will have id of user
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);

    // Step 3 -> check if user exits
    const currentUser = await User.findById(decoded.id);
    // console.log(decoded);
    

    if(!currentUser){
      throw new Error("The user belonging to the token, doesn't exists");
    }

    //  Step 4 -> Check if user changed the password after token issued
    if(currentUser.changedPasswordAfter(decodeURI.iat)){
      throw new Error("User recently changed the password, please login again");
    }

    // Grant access to the protected route
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({
      status: "Failed",
      message: error.message,
    })
  }
}

export {protect};