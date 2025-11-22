import React, { useEffect, useState } from "react";
import "../../CSS/ForgetPassword.css";
import { useForm } from "@tanstack/react-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../store/Users/user-action";
import toast from "react-hot-toast";

const ForgetPassword = () => {

  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const {errors} = useSelector(state => state.user);
  
  // linking jsx to tanstack form
  // props in defaultValues should be sames as name in form.Field
  const form = useForm({
    defaultValues:{
      email:"",
    },
    onSubmit: ({value}) =>{
      console.log(value);
      dispatch(forgotPassword(value.email));
      toast.success("Email sent! please check your mail");
    } 
  });

  useEffect(() => {
    if(errors){
      toast.error(errors);
    }
  },[errors])

  return (
    <>
      <div className='row wrapper'>
        <div className='col-10 col-lg-5'>
          <form onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}>
            <h1 className='password_title'>Forget Password</h1>
            <form.Field name="email">
              {(field) => (
                <div className='form-group'>
                  <label htmlFor='email_field'>Enter Email</label>
                  <input
                    type='email'
                    id='email_field'
                    className='form-control'
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            <button
              id='forgot_password_button'
              type='submit'
              className='btn-block py-3 password-btn'
              //   disabled={loading ? true : false}
            >
              Send Email
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
