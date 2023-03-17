import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import CircularProgress from '@mui/material/CircularProgress';
import "./Register.css";


const Register = () => {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  })

  const { enqueueSnackbar } = useSnackbar();


  const handleChange = (event) =>{
    // console.log("name::",event.target.name)
    // console.log("value::",event.target.value)
    const [key, value] = [event.target.name, event.target.value]
  setFormData((newFormData) =>({...newFormData, [key]: value }))
 
 

  }

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *  
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
   const postData = async()=>{
    if(!validateInput(formData)) return;
try{

  await axios.post(`${config.endpoint}/auth/register`,{
    username: formData.username,
    password: formData.password
  })
  setFormData({
    username: "",
    password: "",
    confirmPasssword: "" 
  })
  enqueueSnackbar("success!", {variant : "success"})
}catch(e){
  if(e.response && e.response.status === 400){
    enqueueSnackbar(e.response.data.message, {variant: "error"})
  }else
   enqueueSnackbar("Uh oh! Some issue occured at the backend", {variant : "error"})
}
    
    console.log("username::", formData.username)
    console.log("password::", formData.password)
  
   }

 

  

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    console.log(data)
    if(!data.username){
      enqueueSnackbar("Username is required", {variant: "warning"})
      return false
    }
    if(data.username.length<6){
      enqueueSnackbar("Username must be atleast 6 characters length")
      return false
    }
    if(!data.password){
      enqueueSnackbar("Password is required", {variant: "warning"})
      return false;
    }
    if(data.password.length<6){
      enqueueSnackbar("Password must be atleast 6 characters length")
      return false;
    }
    if(data.password !== data.confirmPassword){
      enqueueSnackbar("Password and Confirm Password do not match", {variant:"warning"})
      return false;
    }
    return true;
  };
  
  
//validateInput()
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField onChange={handleChange}
            
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value = {formData.username}
            placeholder="Enter Username"
            fullWidth
          />
          <TextField onChange={handleChange}
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value = {formData.password}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField onChange={handleChange}
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value = {formData.confirmPassword}
            type="password"
            fullWidth
          />
           <Button onClick={postData} className="button" variant="contained">
            Register Now
           </Button>
          <p className="secondary-action">
            Already have an account?{" "}
             <a className="link" href="#">
              Login here
             </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
