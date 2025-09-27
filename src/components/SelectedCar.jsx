import React, { useState, useEffect } from "react";

export default function SelectedCar({ car, onDeleteCar, onEditCar, user }) {
  const [technicianComments, setTechnicianComments] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentCarId, setCurrentCarId] = useState(null);

  // Initialize comments only when a new car is selected and not editing
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

  return (
    <div className="bg-stone-400 p-8 rounded-md">
      <h2 className="text-xl font-bold mb-4 text-stone-100">Technician Comments</h2>

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
            <p className="text-stone-100">{technicianComments || "No comments yet."}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
        )
      ) : (
        <p className="text-stone-100">{technicianComments || "No comments available."}</p>
      )}

      {user.role === "admin" && (
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={() => onDeleteCar(car.id)}
        >
          Delete Car
        </button>
      )}
    </div>
  );
}
