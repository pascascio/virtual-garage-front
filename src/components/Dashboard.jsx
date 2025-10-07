import React from "react";
import { useState } from "react";

export default function AdminDashboard({cars, onSelectCar, onStartAddCar, onEditCar}){

    function handleStatusChange(e){
    
    }

    const [searchItem, setSearchItem] = useState('');
    const [filteredCars, setFilteredCars] = useState(cars);

    function handleSearchChange(e){
       const searchTerm = e.target.value;
       setSearchItem(searchTerm)

       const filteredItems = cars.filter((car) => 
        String(car.year).includes(searchTerm) ||
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    setFilteredCars(filteredItems);
    }

  

    const carCounter = {
        pendingCount: 0, 
        completeCount:0, 
        progressCount:0
    }
    
    for (let car of cars){
        if(car.status === "pending"){
            carCounter.pendingCount++;
        }else if(car.status === "repair-complete"){
            carCounter.completeCount++; 
        }else if(car.status === "in-progress"){
            carCounter.progressCount++;
        }
    }

    return (
        
        <div>
            <div>
                <ul className="flex flex-row justify-between gap-4 mb-40">
                    <li className=" bg-stone-50 border-1 border-stone-300 p-6 text-center rounded-xl flex-1 flex flex-start">
                    <h2 className="font-semibold uppercase text-stone-600 text-sm">Pending</h2>
                    <h2 className = "mt-4 p-2 border-2 border-yellow-500 bg-yellow-500/20 w-12 h-16 rounded-full text-3xl text-yellow-500">{carCounter.pendingCount}</h2>
                    </li>
                     <li className=" bg-stone-50 border-1 border-stone-300 p-6 text-center rounded-xl  flex-1  flex  flex-start">
                    <h2 className="font-semibold uppercase text-stone-600 text-sm">Completed</h2>
                    <h2 className = "mt-4 p-2 border-2 border-green-500  bg-green-500/20 w-12 h-16 rounded-full text-3xl text-green-500">{carCounter.completeCount}</h2>
                    </li>
                    <li className=" bg-stone-50 border-1 border-stone-300 p-6 text-center rounded-xl flex-1 flex flex-start">
                    <h2 className="font-semibold uppercase text-stone-600 text-sm">In Progress</h2>
                    <h2 className = "mt-4 bg-sky-400/20 p-2 w-12 h-16 border-2 border-sky-400 rounded-full text-3xl text-sky-400">{carCounter.progressCount}</h2>
                     </li>
                </ul>
            </div>

        <div className = "mt-8 mb-6 flex justify-end">
            <input type = "text"  value = {searchItem} onChange = {handleSearchChange} placeholder="Search Cars...." className = "bg-stone-200 px-6 py-2 rounded-md md:text-base mr-2"></input>
            <button className = "px-6 py-2 mx-1 md:text-base rounded-md bg-cyan-500/70 text-stone-200 hover:bg-stone-950" onClick={() => { 
    console.log("Add button clicked"); 
    onStartAddCar(); 
  }}> + Add New Car </button>
        </div>
      
      

        <div className ="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className ="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className ="text-xs text-stone-50 uppercase bg-stone-900 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                <th scope = "col" className = "px-6 py-3">Status</th>
                <th scope = "col" className ="px-6 py-3">Car</th>
                <th scope = "col" className ="px-6 py-3">License </th>
                <th scope = "col" className = "px-6 py-3">Customer</th>
                <th scope = "col" className = "px-6 py-3">Action</th>
                </tr>
                </thead>
                <tbody>
                {filteredCars.map((car) =>  {
let statusClasses = "rounded-full font-semibold  p-1 text-center text-sm";
if(car.status === "reviewing" || car.status === "in-progress"){
    statusClasses += " bg-sky-400/60 text-sky-900"
   }else if(car.status === "awaiting"){
    statusClasses += " bg-red-500"
   }else if(car.status === "repair-complete"){
    statusClasses += " bg-green-500/60 text-green-900"
   }else if(car.status === "pending"){
    statusClasses += " bg-yellow-500/60 text-yellow-900"
   }
   return (
                <tr key = {car.id} className= "bg-white border-b border-gray-200 hover:bg-stone-200">
                    <td className= "px-6 py-4"><div className = {statusClasses}>
                    <form className="max-w-sm mx-auto">
  <label htmlFor="status" ></label>
  <select id="status" defaultValue = {car.status} onChange={(e) => {
  const newStatus = e.target.value;
  onEditCar(car.id, { status: newStatus });

  // Update the table row immediately
  setFilteredCars((prev) =>
    prev.map((c) =>
      c.id === car.id ? { ...c, status: newStatus } : c
    )
  );
}}
 className = {statusClasses}>
    <option value = "pending">Pending</option>
    <option value = "reviewing" >Reviewing</option>
    <option value = "repair-complete">Complete</option>
    <option value= "awaiting">Awaiting</option>
  </select>
  </form>
                        </div></td>
                    <td className="px-6 py-4 font-semibold">{car.year} {car.make} {car.model}</td>
                    <td className="px-6 py-4 font-semibold text-xs">{car.license}</td>
                    <td className="px-6 py-4">{car.createdBy.name}</td>
                    <td className = "px-6 py-4">  <button onClick = {() => onSelectCar(car.id)} className="font-medium border p-2 rounded-md bg-stone-500 text-stone-50 hover:bg-stone-500/50"> Select</button>
                    </td>
                </tr>
            )
})}
                </tbody>
            </table>
        </div>
        </div>
    )
}