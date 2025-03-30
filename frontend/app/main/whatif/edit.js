"use client";

import { useState } from "react";

export default function FormComponent() {
  const [formData, setFormData] = useState({ field1: "", field2: "", field3: "" });
  const [boxes, setBoxes] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.field1 && formData.field2 ) {
      setBoxes([...boxes, formData]); // Add new box
      setFormData({ field1: "", field2: "" , field3: ""}); // Reset form
    }
  };

  return (
    <div className="p-4 border rounded-lg ">
      <h2 className="text-lg font-semibold mb-4 text-center">What if I want to </h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Input fields with titles and horizontal layout */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Purchase </label>
            <input
              type="text"
              name="field1"
              value={formData.field1}
              onChange={handleChange}
              placeholder="Enter item name"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Price</label>
            <input
              type="number"
              name="field2"
              value={formData.field2}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">No idea tbh</label>
            <input
              type="text"
              name="field3"
              value={formData.field3}
              onChange={handleChange}
              placeholder="We ball"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Create Box
        </button>
      </form>

      {/* Display Created Boxes */}
      <div className="mt-4 space-y-2">
        {boxes.map((box, index) => (
          <div
            key={index}
            className="p-4 border rounded bg-gray-100 shadow-md"
          >
            <p className="font-bold">Name: {box.field1}</p>
            <p>Price: {"$"+box.field2}</p>
            <p>
                Give me some
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
