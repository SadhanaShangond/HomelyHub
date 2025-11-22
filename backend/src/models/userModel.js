import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email Id"],
      // validate:{
      //   validator: function(e){
      //     return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e)
      //   },
      //   message: "Please enter a valid email"
      // },
    },
    password: {
      type: String,
      required: [true, "Pleae enter your password"],
      minlength: [6,"Your password must be longer than 6 characters"],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords do not match",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter your number"],
      unique: true,
    },
    avatar:{
      url: {type: String},
      public_id: {type: String},
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// Encrypt password before saving(Document Middleware)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hash the password with salt value as 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // remove confirm field
  next();
});

// Compare passwords
userSchema.methods.correctPassword = async function (enteredPassword, userPassword) {
  return await bcrypt.compare(enteredPassword, userPassword);
};
 
// Checking for whether the password is changed after receving token
userSchema.methods.changedPasswordAfter = function(JWTTimeStamp){
  if(this.passwordChangedAt){
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime / 1000, 10);
    return JWTTimeStamp < changedTimeStamp
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
}
const User = mongoose.model("User", userSchema);
export default User;
