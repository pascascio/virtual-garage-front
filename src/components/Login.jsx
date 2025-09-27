import { useActionState, useRef } from "react"
import Modal from './Modal'

import{isNotEmpty, 
    hasMinLength, 
    isEmail,
} from '../util/validation';

export default function Login({onLogin, onSignUpClick}){

    const modal = useRef();

    function handleLogin(prevFormState,formData){

        const email = formData.get('email');
        const password = formData.get('password')

        let errors = [];

        if(!isNotEmpty(email) || !isEmail(email)){
            errors.push('Please enter valid email')
          }
        if(!isNotEmpty(password) && !hasMinLength(password, 6)){
            errors.push('Password must have at least 6 characters');
        }

        if(errors.length > 0){
            modal.current.open();
            return {errors, enteredValues: {
                email, 
                password,
            },};
        }


        onLogin({
            email, 
            password,
        })

        return {errors:null};

    }

    const [formState, formAction] = useActionState(handleLogin, {errors:null})

   

    let labelClasses = "mb-1 font-light text-sm text-stone-200"
    let inputClasses = "mb-6 w-full p-1 bg-stone-800 border-b-1 border-stone-400 text-stone-200"
    return(
        <div className = "bg-stone-800 font-lightflex flex-col min-h-full justify-center px-6 py-12 rounded-md" >
        <form noValidate action = {formAction} className = "flex flex-col gap-4 ">
            <div className = "flex flex-col text-stone-400 p-6">
            <div className = "mb-4 text-stone-200 ">
            <h2 className = "mb-6 text-center text-xl text-bold">Log In</h2>
            <p className = "mb-6">Please enter your email and password to access the Garage!</p>
            </div>
            <label htmlFor = "email" className = {labelClasses}> Email: </label>
            <input name = "email" type = "email" id = "email" className = {inputClasses} defaultValue = {formState.enteredValues?.email}></input>
            <label htmlFor = "password" className = {labelClasses}>Password: </label>
            <input name = "password" type = "password" id = "password" className = {inputClasses} defaultValue = {formState.enteredValues?.password}></input>
            <button type = "submit" className = "font-light px-4 py-2 mx-1  mb-10 md:text-base rounded-md bg-stone-200 text-stone-800 hover:bg-stone-500 hover:text-stone-200">Log In</button>
            </div>  
            <div className = "text-center"> 
                <p className = "text-stone-200 text-xs uppercase">Already have an account? <button onClick = {onSignUpClick} className = "text-stone-400 text-xs uppercase hover:text-stone-200">Sign Up</button></p>
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