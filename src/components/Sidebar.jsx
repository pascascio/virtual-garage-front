export default function Sidebar({onStartAddCar, cars, onSelectCar, selectedCarId}){
    return(
        <aside className = "w-1/3 bg-stone-900 px-8 py-16 text-stone-50 md:w-72 rounded-r-xl">
            <h2 className = "mb-8 font-bold uppercase md: text-xl text-stone-200">My Cars</h2>
            <div> 
            <button onClick = {onStartAddCar} className = "mb-6 px-4 py-2 text-xs md:text rounded-md bg-stone-700 text-stone-400 hover:bg-stone-600 hover:text-stone-100"> + Add Car</button>
            <ul>
                {cars.map(
                    (car) =>{
                      let cssClasses = "w-full text-left px-2 py-1 rounded-sm my-1 hover:text-stone-200 hover:bg-stone-800"   

                      if(car.id === selectedCarId){
                        cssClasses += " bg-stone-800 text-stone-200";
                      }else{
                        cssClasses += ' text-stone-400'
                      }
                        return (
                    <li key = {car.id}>
                        <button className = {cssClasses} onClick = {() => onSelectCar(car.id)}>{car.year} {car.make} {car.model}</button>
                    </li>
                        )
                    }
                )}
            </ul>
            </div>
        </aside>
    )
}