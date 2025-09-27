import React from "react";
import { useState, useEffect } from "react";


export default function SelectedCar({car, onDeleteCar, onEditCar, user}){

    const [technicianComments, setTechnicianComments] = useState(car.technicianComments || "" );

    useEffect(() => {
      setTechnicianComments(car.technicianComments || "");
    }, [car]);

    function handleCommentChange(e){
        setTechnicianComments(e.target.value);
    }

    let statusClasses = "text-transform: capitalize px-6 py-2 md:text-base rounded-md text-stone-50 mb-4";

   if(car.status === "reviewing" || car.status === "in-progress"){
    statusClasses += " bg-sky-400/75"
   }else if(car.status === "awaiting"){
    statusClasses += " bg-red-500"
   }else if(car.status === "complete"){
    statusClasses += " bg-green-500/75"
   }else if(car.status === "pending"){
    statusClasses += " bg-yellow-500/75"
   }
    console.log(car.status)
    return(
        <div className = "w-[35rem] mt-16 ">
            <span className = {statusClasses}>{car.status}</span>
            <header className = "pb-4 mt-8 mb-4 border-b-2 border-stone-300">
                <div className = "flex items-center justify-between">
                <h1 className = "text-3xl font-bold text-stone-600 mb-2">{car.year}  {car.make}  {car.model}</h1>
                <div className = "inline-flex rounded-md shadow-xs" role ="group">
                <button className = "px-4 py-2 md: text-sm font-medium  border border-gray-900 rounded-s-lg bg-stone-800 text-stone-50 hover:bg-stone-950" onClick = {onEditCar}>Edit</button>
                <button  className = "px-4 py-2 md: text-sm font-medium rounded-e-lg bg-stone-800 text-stone-50 hover:bg-stone-950" onClick = {() => onDeleteCar(car.id)}> Delete </button>
                </div>
                </div>
                <p className = "mb-4 text-stone-950">License: {car.license}</p>
                <p className = "text-stone-950 whitespace-pre-wrap">{car.repairConcerns}</p>
            </header>
            <div className="bg-stone-400 p-8 rounded-md">
  <h2 className="text-xl font-bold mb-4 text-stone-100">Technician Comments</h2>

  {user.role === "admin" ? (
    technicianComments ? (
      <p>{technicianComments}</p>
    ) : (
      <div>
        <textarea
          className="bg-stone-200 w-120 h-50"
          placeholder="Enter comments here..."
          value={technicianComments}
          onChange={handleCommentChange}
        ></textarea>
        <button
          className="px-4 py-2 text-sm font-medium rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950"
          onClick={() => {
            console.log("Save clicked!", car.id, technicianComments);
            onEditCar(car.id, { technicianComments });
          }}
        >
          Save
        </button>
      </div>
    )
  ) : (
    <p>{car.technicianComments ? car.technicianComments : "Nothing to see here..."}</p>
  )}
</div>

        </div>
    )
}