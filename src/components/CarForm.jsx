import React, { useState, useEffect } from "react";

export default function CarForm({ user, onAdd, onEdit, car, onCancel }) {
  const [formData, setFormData] = useState({
    year: "",
    make: "",
    model: "",
    license: "",
    repairConcerns: "",
  });

  // ✅ Pre-fill form if editing
  useEffect(() => {
    if (car) {
      setFormData({
        year: car.year || "",
        make: car.make || "",
        model: car.model || "",
        license: car.license || "",
        repairConcerns: car.repairConcerns || "",
      });
    }
  }, [car]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (car) {
      // ✅ Editing existing car
      onEdit(car.id, formData);
    } else {
      // ✅ Adding new car
      onAdd(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Year"
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          name="make"
          value={formData.make}
          onChange={handleChange}
          placeholder="Make"
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          placeholder="Model"
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          name="license"
          value={formData.license}
          onChange={handleChange}
          placeholder="License"
          className="border p-2 rounded-md"
        />
      </div>

      <textarea
        name="repairConcerns"
        value={formData.repairConcerns}
        onChange={handleChange}
        placeholder="Repair Concerns"
        className="border p-2 rounded-md w-full mt-4"
      />

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          {car ? "Update Car" : "Add Car"}
        </button>

        {car && onCancel && (
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
