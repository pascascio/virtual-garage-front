import Car from '/car.png';

export default function ClientDashboard({ cars, onSelectCar, onAddCar }) {
  return (
    <div className = "mt-10 flex justify-center">
    <div className="flex flex-wrap gap-6 justify-center md:flex-row md:flex-wrap md:gap-6 md:items-stretch">
      {cars.map((car) => {
        let statusClasses =
          "capitalize px-6 py-2 md:text-base rounded-md text-stone-50 mb-2";

        if (car.status === "reviewing" || car.status === "in-progress") {
          statusClasses += " bg-sky-400/75";
        } else if (car.status === "awaiting") {
          statusClasses += " bg-red-500";
        } else if (car.status === "repair-complete") {
          statusClasses += " bg-green-500/75";
        } else if (car.status === "pending") {
          statusClasses += " bg-yellow-500/75";
        }

        return (
          <div
            key={car.license}
            className="flex flex-col bg-stone-600 rounded-md overflow-hidden w-full md:w-1/3"
          >
            <div className="bg-stone-200 p-8 flex items-center justify-center">
              <img
                src={Car}
                alt="gray car placeholder"
                className="h-20 w-20 object-contain"
              />
            </div>
            <div className="bg-stone-600 p-4 flex flex-col flex-1 justify-between">
              <div>
                <span className={statusClasses}>{car.status}</span>
                <h2 className="text-2xl font-bold text-stone-200 mb-2 mt-2">
                  {car.year} {car.make} {car.model}
                </h2>
                <p className="mb-4 text-stone-300 text-sm">{car.license}</p>
              </div>
              <button
                className="mt-2 px-4 py-2 bg-stone-700 rounded-md hover:bg-stone-800 text-stone-200 "
                onClick={() => onSelectCar(car.id)}
              >
                Details
              </button>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
}
