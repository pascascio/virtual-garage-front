import React, { useState, useEffect } from "react";

export default function SelectedCar({ car, onDeleteCar, onEditCar, user }) {
  const [technicianComments, setTechnicianComments] = useState(car?.technicianComments || "");
  const [isEditing, setIsEditing] = useState(false);

  // Only reset comments when a different car is selected
  useEffect(() => {
    setTechnicianComments(car?.technicianComments || "");
    setIsEditing(false);
  }, [car?.id]);

  function handleCommentChange(e) {
    setTechnicianComments(e.target.value);
  }

  // Status styling
  let statusClasses = "capitalize px-6 py-2 md:text-base rounded-md text-stone-50 mb-4";

  if (car.status === "reviewing" || car.status === "in-progress") {
    statusClasses += " bg-sky-400/75";
  } else if (car.status === "awaiting") {
    statusClasses += " bg-red-500";
  } else if (car.status === "complete") {
    statusClasses += " bg-green-500/75";
  } else if (car.status === "pending") {
    statusClasses += " bg-yellow-500/75";
  }

  return (
    <div className="w-[35rem] mt-16">
      <span className={statusClasses}>{car.status}</span>

      <header className="pb-4 mt-8 mb-4 border-b-2 border-stone-300">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-stone-600 mb-2">
            {car.year} {car.make} {car.model}
          </h1>
          <div className="inline-flex rounded-md shadow-xs" role="group">
            <button
              className="px-4 py-2 md:text-sm font-medium border border-gray-900 rounded-s-lg bg-stone-800 text-stone-50 hover:bg-stone-950"
              onClick={() => onEditCar(car.id)}
            >
              Edit
            </button>
            <button
              className="px-4 py-2 md:text-sm font-medium rounded-e-lg bg-stone-800 text-stone-50 hover:bg-stone-950"
              onClick={() => onDeleteCar(car.id)}
            >
              Delete
            </button>
          </div>
        </div>
        <p className="mb-4 text-stone-950">License: {car.license}</p>
        <p className="text-stone-950 whitespace-pre-wrap">{car.repairConcerns}</p>
      </header>

      <div className="bg-stone-400 p-8 rounded-md">
        <h2 className="text-xl font-bold mb-4 text-stone-100">Technician Comments</h2>

        {user.role === "admin" ? (
          isEditing ? (
            <div className="space-y-2">
              <textarea
                className="bg-stone-200 w-full h-40 p-2 rounded-md"
                placeholder="Enter comments here..."
                value={technicianComments}
                onChange={handleCommentChange}
              />
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 text-sm font-medium rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950"
                  onClick={() => {
                    onEditCar(car.id, { technicianComments });
                    setIsEditing(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium rounded-md bg-gray-500 text-stone-50 hover:bg-gray-600"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p className="flex-1">{technicianComments || "Nothing to see here..."}</p>
              <button
                className="px-4 py-2 text-sm font-medium rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950 ml-4"
                onClick={() => setIsEditing(true)}
              >
                Edit Comments
              </button>
            </div>
          )
        ) : (
          <p>{car.technicianComments || "Nothing to see here..."}</p>
        )}
      </div>
    </div>
  );
}
