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
    if (formData.field1 && formData.field2 && formData.field3) {
      setBoxes([...boxes, formData]); // Add new box
      setFormData({ field1: "", field2: "" , field3: ""}); // Reset form
    }
  };

  return (
    <div className="p-4 border rounded-lg ">
      <h2 className="text-lg font-semibold mb-4 text-center">Create a Box</h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Input fields with titles and horizontal layout */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Field 1</label>
            <input
              type="text"
              name="field1"
              value={formData.field1}
              onChange={handleChange}
              placeholder="Enter first value"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Field 2</label>
            <input
              type="text"
              name="field2"
              value={formData.field2}
              onChange={handleChange}
              placeholder="Enter second value"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Field 3</label>
            <input
              type="text"
              name="field3"
              value={formData.field3}
              onChange={handleChange}
              placeholder="Enter second value"
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
            <p className="font-bold">Field 1: {box.field1}</p>
            <p>Field 2: {box.field2}</p>
            <p>Field 3: {box.field3}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
