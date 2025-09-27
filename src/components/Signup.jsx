import { useActionState, useRef } from "react";
import Modal from './Modal'

import {
  isNotEmpty, 
  hasMinLength, 
  isEmail, 
  isEqualToOtherValue
} from '../util/validation';

export default function Signup({onLoginClick, onSubmit}){

  const modal = useRef();

  function handleSignUp(prevFormState, formData){
    const fname = formData.get('fname');
    const lname = formData.get('lname');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');

    let errors = [];

    if(!isNotEmpty(fname) || !isNotEmpty(lname)){
      errors.push('Please enter valid name')
    }
    if(!isNotEmpty(email) || !isEmail(email)){
      errors.push('Please enter valid email')
    }
    if(!isNotEmpty(password) && !hasMinLength(password, 6)){
      errors.push('Password must have at least 6 characters');
  }
  if(!isEqualToOtherValue(password,confirmPassword)){
    errors.push('Passwords do not match, please re-enter!')
  }

  if(errors.length > 0){
    modal.current.open();
    return {errors, enteredValues: {
      fname, 
      lname, 
      email, 
      password,
      confirmPassword,
    },};
}
  onSubmit({
    fname, 
    lname, 
    email, 
    password,
  })
  return {errors: null};
  }
 
  const [formState, formAction] = useActionState(handleSignUp, {errors:null});

  function handleModalBtn(){
    formState.errors = null;
  }
  
  let labelClasses = "mb-1 text-sm  text-stone-200 font-light"
  let inputClasses = "mb-6 w-full p-1 border-b border-stone-500 bg-stone-800  text-stone-200 focus:outline-none focus:border-stone-600"

    return(
      <div className = "bg-stone-800 flex flex-col min-h-full justify-center px-6 py-12 text-stone-200 rounded-md" >
        <form action = {formAction} noValidate  className = "flex flex-col gap-4 ">
        <div  className = "flex flex-col  p-6">
        <h2 className = "mb-6 text-center text-2xl font-light">Welcome to the Garage </h2>
        <p className = "mb-8 text-center">We just need a little bit of data from you to get started!</p>

        <div className="control-row">
          <div className="control">
            <label htmlFor="first-name" className = {labelClasses}>First Name: </label>
            <input type="text" id="first-name" name="fname" className = {inputClasses} defaultValue = {formState.enteredValues?.fname}
            required />
          </div>
  
          
            <label htmlFor="last-name" className = {labelClasses}>Last Name: </label>
            <input type="text" id="last-name" name="lname" required  className = {inputClasses} defaultValue = {formState.enteredValues?.lname}/>
        </div>

   

        <div className="control">
          <label htmlFor="email" className = {labelClasses}>Email: </label>
          <input id="email" type="email" name="email" required className = {inputClasses} defaultValue = {formState.enteredValues?.email}/>
        </div>
  
        <div className="control-row">
          <div className="control">
            <label htmlFor="password" className = {labelClasses}>Password: </label>
            <input id="password" type="password" name="password" required  minLength={6} className = {inputClasses} defaultValue = {formState.enteredValues?.password}/>
          </div>
  
          <div className="control">
            <label htmlFor="confirm-password" className = {labelClasses}>Confirm Password: </label>
            <input
              id="confirm-password"
              type="password"
              name="confirm-password"
              className = {inputClasses}
              defaultValue = {formState.enteredValues?.confirmPassword}
              required
            />
          </div>
        </div>
        
  
  <div>
          <button type="submit" className = "font-light px-4 py-2 mx-1  mb-10 md:text-base rounded-md bg-stone-200 text-stone-800 hover:bg-stone-500 hover:text-stone-200">
            Sign Up
          </button>
          <p className = "text-xs font-semibold uppercase text-center">Already have an account? <button className = "text-stone-400 hover:text-stone-200 font-semibold uppercase" onClick = {onLoginClick}>Log In</button></p>
  </div>
  </div>
  <Modal ref = {modal}>
           
           <h2 className = "text-xl font-bold text-stone-500 my-4"> Error: Invalid Input</h2>
           {formState.errors && (<ul className = "errors">
               {formState.errors.map((error) => (
                <li key = {error} className = "text-stone-400 mb-2"> {error}</li> 
               ))}
           </ul>
       )}
           </Modal>
   

        </form>
        </div>
    )
}