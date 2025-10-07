import React, { useState, useEffect } from "react";
import CarForm from "./CarForm"; // ✅ Make sure path is correct

export default function SelectedCar({ car, onDeleteCar, onEditCar, user }) {
  const [technicianComments, setTechnicianComments] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingCar, setIsEditingCar] = useState(false);
  const [currentCarId, setCurrentCarId] = useState(null);

  function handleEditCar() {
    setIsEditingCar(true);
  }

  // Initialize comments when a new car is selected
  useEffect(() => {
    if (car && car.id !== currentCarId && !isEditing) {
      setTechnicianComments(car.technicianComments || "");
      setCurrentCarId(car.id);
    }
  }, [car, currentCarId, isEditing]);

  const handleChange = (e) => setTechnicianComments(e.target.value);

  const handleSave = () => {
    onEditCar(car.id, { technicianComments });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTechnicianComments(car.technicianComments || "");
    setIsEditing(false);
  };

  if (!car) return <p>Loading car details...</p>;

  let statusClasses =
    "capitalize px-6 py-2 md:text-base rounded-md text-stone-50 mb-4";

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
    <div className="bg-stone-400 p-8 rounded-md w-full max-w-2xl">
      {isEditingCar ? (
        <div className="w-[35rem] mt-16">
          <CarForm
            user={user}
            car={car}
            onEditCar={onEditCar}
            onCancel={() => setIsEditingCar(false)}
          />
        </div>
      ) : (
        <>
          <span className={statusClasses}>{car.status}</span>
          <header className="pb-4 mt-8 mb-4 border-b-2 border-stone-300">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-stone-600 mb-2">
                {car.year} {car.make} {car.model}
              </h1>
              <div className="inline-flex rounded-md shadow-xs" role="group">
                <button
                  className="px-4 py-2 text-sm font-medium border border-gray-900 rounded-s-lg bg-stone-800 text-stone-50 hover:bg-stone-950"
                  onClick={handleEditCar}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium rounded-e-lg bg-stone-800 text-stone-50 hover:bg-stone-950"
                  onClick={() => onDeleteCar(car.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mb-4 text-stone-950">License: {car.license}</p>
            <p className="text-stone-950 whitespace-pre-wrap">
              {car.repairConcerns}
            </p>
          </header>

          <h2 className="text-xl font-bold mb-4 text-stone-100">
            Technician Comments
          </h2>

          {user.role === "admin" ? (
            isEditing ? (
              <div className="flex flex-col gap-2">
                <textarea
                  className="bg-stone-200 w-full h-32 p-2 rounded-md"
                  value={technicianComments}
                  onChange={handleChange}
                />
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <p className="text-stone-100">
                  {technicianComments || "No comments yet."}
                </p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              </div>
            )
          ) : (
            <p className="text-stone-100">
              {technicianComments || "No comments available."}
            </p>
          )}
        </>
      )}
    </div>
  );
}
