import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import imagekit from "../utils/imagekitio.js";
import { forgotPasswordMailGenContent, sendMail } from "../utils/mail.js";
import crypto from "crypto";

const defaultAvatar = "https://i.pravatar.cc/150?img=3";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24* 60 * 60 *1000),
    httpOnly: true,
  };

  res.cookie("jwt", token ,cookieOptions);

  // Remove password
  user.password = undefined;

  res.status(statusCode).json({
    status: "Success",
    token,
    user,
  })
};

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el]
  });
  return newObj;
};

const signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      avatar: {url: req.body.avatar || defaultAvatar},
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    if(!email || !password){
      throw new Error("Please provide email and password");
    }

    const user = await User.findOne({email}).select("+password");

    if(!user || (await user.correctPassword(password, user.password)) === false){
      throw new Error("Incorrect email or password");
    }

    createSendToken(user,200,res);
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

const logout = async (req,res) => {
  res.cookie("jwt","loggedout",{
    expires: new Date(Date.now() + 10 * 100),
    httpOnly: true
  });

  res.status(200).json({status: "Sucess"});
};

const updateMe = async (req,res) => {
  try {
    const filterBody = filterObj(req.body, "name", "phoneNumber", "avatar");
    // console.log(filterBody);
    
    if(req.body.avatar !== undefined){
      let base64Data = req.body.avatar;

      const uploadResponse = await imagekit.upload({
        file: base64Data,
        fileName: `avatar_${Date.now()}.jpg`,
        folder: "avatar",
        transformation: {pre: "w-150, h-150, c-scale"},
      });

      console.log(uploadResponse);
      
      filterBody.avatar = {
        public_id: uploadResponse.fileId,
        url: uploadResponse.url,
      };
      console.log(filterBody);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
      new: true,
      runValidators: true, // it tells node to run validators in models,
      useFindAndModified: false,
    });

    res.status(200).json({
      status: "Success",
      data: {
        user: updatedUser,
      }
    });
  } catch (error) {
    res.status(401).json({
      status: "Failed",
      message: error.message,
    });
  }
};

const updatePassword = async (req,res) => {
  try {
    const {currentPassword, newPassword, confirmPassword} = req.body;

    // 1 get current user
    const user = await User.findById(req.user.id).select("+password");

    // Step 2 -> get the current password from body and compare with password save inside the db
    if(!(await user.correctPassword(currentPassword,user.password))){
      throw new Error("Your password is wrong!");
    }

    // step 3 -> current password is correct update the new password
    user.password = newPassword;
    user.passwordConfirm = confirmPassword;
    await user.save();

    // step 4 -> log the use in by sending the token
    createSendToken(user, 200,res);
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    })
  }
};

const check = async (req,res) => {
  try {
    res.status(200).json({
      status: "Sucess",
      message: "Logged In",
      user: req.user
    });
  } catch (error) {
    res.status(400).json({
      status: "Fialed",
      message: "UnAuthorized",
    });
  }
};

const forgotPassword = async (req,res) => {
  //Step 1 -> Get the user through email id provided in the input value
  const user = await User.findOne({email: req.body.email});
  if(!user){
    res.status(400).json({
      error: "There is no user with this email",
    });
  }

  // Step 2 -> Generate the reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({validateBeforeSave: false});

  const resetUrl = `http://localhost:3000/user/resetPassword/${resetToken}`;

  // Step 3 -> Send the mail
  try {
    await sendMail({
      email: user.email,
      subject: "Reset Your Password(Valid only for 10 minutes)",
      mailGenContent: forgotPasswordMailGenContent(user.name, resetUrl),
    });

    res.status(200).json({
      status: "Success",
      message: "Token sent successfully",
    })
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const resetPassword = async(req, res) => {
  try {
    // Get user based Token 
    const hasedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    
    const user = await User.findOne({
      passwordResetToken: hasedToken,
      passwordResetExpires: {$gt: Date.now()},
    });

    // console.log(user);
    

    // step 2 -> if token not expires there is an user, set a new password
    if(!user){
      throw new Error("Token is invalid or expired");
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    //  step 3- > Log the user and send token
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      error: error.message,
    })
  }
}

export {signup, login, logout, check, updateMe, updatePassword, forgotPassword, resetPassword};