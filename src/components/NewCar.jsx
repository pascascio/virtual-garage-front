import { useActionState, useRef } from "react";
import Modal from './Modal'

import {
    isNotEmpty, 
    hasMinLength, 
} from '../util/validation';


export default function NewCar({onAdd, onCancel, user}){
   
    const modal = useRef();

    function handleSaveCar(prevFormState,formData){
       const year = formData.get('year');
       const make = formData.get('make');
       const model = formData.get('model');
       const license = formData.get('license');
       const repairConcerns = formData.get('repair-concerns');
       const status = formData.get('status');

       let errors = [];

       if(!isNotEmpty(year) || !hasMinLength(year,4)){
           errors.push('Please enter valid year')
       }
   
       if(!isNotEmpty(make) || !hasMinLength(make,3)){
           errors.push('Please enter valid make')
       }
   
       if(!isNotEmpty(model)){
           errors.push('Please enter valid model')
       }
   
       if(!isNotEmpty(license) || !hasMinLength(license,7)){
           errors.push('Please enter license plate')
       }
   
       if(!isNotEmpty(repairConcerns)){
           errors.push('Please enter repair concerns')
       }
   
       if(errors.length > 0){
            modal.current.open();
           return {errors, enteredValues: {
            year, 
            make,
            model, 
            license, 
            repairConcerns, 
            status,
           },};
          
       }
       
       onAdd({
        year, 
        make, 
        model, 
        license, 
        repairConcerns, 
        status,
       })
       return {errors: null};
    }

  



    const [formState,formAction  ] = useActionState(handleSaveCar, {errors: null});

    function handleModalBtn(){
        formState.errors = null;
    }

let labelClasses = "text-sm font-bold uppercase text-stone-600"
let inputClasses = "w-full p-1 border-b-2 rounded-sm border-stone-300 bg-stone-200  text-stone-600 focus:outline-none focus:border-stone-600"
    return(
        <form action = {formAction} className = "add-car-form-container">
        <div className="w-[35rem] mt-16">
            <menu className = "flex items-center justify-end gap-4 my-4">
                <li> <button  onClick = {onCancel} className = "text-stone-800 hover:text-stone-950">Cancel</button></li>
                <li><button className = "px-6 py-2 md: text-base rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950">Save</button></li>     
            </menu>
            <div className = "flex flex-col"> 
                <label className = {labelClasses}>Year</label>
                <input type ="year" name = "year" defaultValue={formState.enteredValues?.year} className = {inputClasses}/>
                <label className = {labelClasses}>Make</label>
                <input type ="text" name = "make" defaultValue={formState.enteredValues?.make} className = {inputClasses}/>
                <label className = {labelClasses}>Model</label>
                <input type ="text" name ="model" defaultValue={formState.enteredValues?.model} className = {inputClasses}/>
                <label className = {labelClasses}>License </label>
                <input type = "string" name = "license" defaultValue={formState.enteredValues?.license} className = {inputClasses}/>
                <label className = {labelClasses}>Repair Concerns</label>
                <textarea name = "repair-concerns" defaultValue={formState.enteredValues?.repairConcerns} className = "w-full p-1 border-b-2 rounded-sm border-stone-300 bg-stone-200  text-stone-600 focus:outline-none focus:border-stone-600" />
                {user.role === "admin" ?
                <>
                <label className = {labelClasses}>Status</label>
               <select id="car-status" name="status" defaultValue={formState.enteredValues?.status} className = {inputClasses}>
                     <option value="pending">Pending</option>
                     <option value="reviewing">Review In Progress</option>
                     <option value="awaiting">Awaiting Customer Approval</option>
                     <option value="in-progress">Repair in Progress</option>
                     <option value="repair-complete">Repair Complete</option></select>
                     </> : ""
                     }

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
    )
}