export default function NoCarSelected({onStartAddCar}){

    
    return(
        <div className = "mt-24 text-center w-2/3">
            <img src = "logo.png" alt ="virtual-garage-logo" className = "w-16 h-16 object-contain mx-auto"/>
            <h2 className = "text-cl font-bold text-stone-500 my-4">No Car Selected</h2>
            <p className = "text-stone-400 mb-4"> Select a car or add a new car to get started!</p>
            <p><button onClick = {onStartAddCar} className = "px-4 py-2 text-xs md:text-base rounded-md bg-stone-700 text-stone-400 hover:bg-stone-600  hover:text-stone-100" > Add New Car</button></p>
        </div>
    
    )
}