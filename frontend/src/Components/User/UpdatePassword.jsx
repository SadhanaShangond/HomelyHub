import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../../store/Users/user-action.js";
import { userActions } from "../../store/Users/user-slice.js";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [currentPassword,setCurrentPassword ] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const {errors,success} = useSelector(state => state.user);
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    // const formData = new FormData();
    // formData.set("oldPassword", oldPassword);
    // formData.set("password", password);
    // formData.set("passwordConfirm", passwordConfirm);
    if(newPassword !== confirmPassword){
      toast.error("Password does not match");
      return false;
    }else{
      console.log(currentPassword, newPassword, confirmPassword);
      
      dispatch(updatePassword({currentPassword,newPassword,confirmPassword}));
    }
  };

  useEffect(() => {
    if(errors){
      toast.error(errors);
      dispatch(userActions.clearErrors());
    }
    else if(success){
      toast.success("Password updated successfully");
      navigate("/profile");
      dispatch(userActions.getPasswordSuccess(false));
    }
  },[errors, success, navigate, dispatch]);

  return (
    <>
      {/* <MetaData title={"Change Password"} /> */}

      <div className='row wrapper'>
        <div className='col-10 col-lg-5 updateprofile'>
          <form onSubmit={submitHandler}>
            <h1 className='password_title'>Update Password</h1>
            <div className='form-group'>
              <label for='old_password_field'>Old Password</label>
              <input
                type='password'
                id='old_password_field'
                className='form-control'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className='form-group'>
              <label for='new_password_field'>New Password</label>
              <input
                type='password'
                id='new_password_field'
                className='form-control'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className='form-group'>
              <label for='new_password_confirm_field'>
                New Password Confirm
              </label>
              <input
                type='password'
                id='new_password_confirm_field'
                className='form-control'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type='submit'
              className='btn-block py-3 password-btn'
              //   disabled={loading ? true : flse}
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;
