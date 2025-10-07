import { useActionState, useRef } from "react"
import Modal from './Modal'
import logo from '/logo.png';

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

   

    let labelClasses = "mb-1 font-light text-sm text-stone-800"
    let inputClasses = "mb-6 p-1 bg-stone-200 border-b-1 border-stone-400 text-stone-800 outline-none"
    return(
        <div flex flex-col >
        <div className = "p-10 h-60 w-full bg-linear-to-r from-stone-600 to-stone-800 ">
        <img src = {logo} alt = "virtual garage logo" className = "h-20 w-20 object-center"/>
        <h1 className = "text-4xl text-stone-200 font-bold mb-2">Virtual Garage</h1>
        <p className = "text-stone-300">Manage your car repair data securely and conveniently</p>
        </div>
        <div className = "bg-stone-200 w-full font-light flex flex-col min-h-full justify-center px-6 py-12 rounded-md" >
        <form noValidate action = {formAction} className = "flex flex-col gap-4 ">
            <div className = "flex flex-col text-stone-400 p-6">
            <div className = "mb-4 text-stone-800 ">
            <h2 className = "mb-3 text-center text-xl font-semibold">Welcome Back</h2>
            <p className = "mb-6 text-center">Please enter your email and password to access the Garage</p>
            </div>
            <label htmlFor = "email" className = {labelClasses}> Email: </label>
            <input name = "email" type = "email" id = "email" className = {inputClasses} defaultValue = {formState.enteredValues?.email}></input>
            <label htmlFor = "password" className = {labelClasses}>Password: </label>
            <input name = "password" type = "password" id = "password" className = {inputClasses} defaultValue = {formState.enteredValues?.password}></input>
            <button type = "submit" className = "font-light px-4 py-2 mx-1  mb-10 md:text-base rounded-md text-stone-200 bg-stone-800 hover:bg-stone-500 hover:text-stone-200 w-30 object-center">Log In</button>
            </div>  
            <div className = "text-center"> 
                <p className = "text-stone-800 text-xs font-semibold uppercase">Already have an account? <button onClick = {onSignUpClick} className = "text-stone-500 text-xs uppercase hover:text-stone-900">Sign Up</button></p>
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
        </div>
    )
}