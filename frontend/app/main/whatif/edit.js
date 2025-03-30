"use client";

import { useState } from "react";

export default function FormComponent() {
  const [formData, setFormData] = useState({ field1: "", field2: "" });
  const [boxes, setBoxes] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.field1 && formData.field2) {
      const itemPrice = Number(formData.field2);
      let extraFees = {};

      const itemType = formData.field1.toLowerCase();
      if (itemType === "car") {
        extraFees = calculateCarFees(itemPrice);
      } else if (itemType === "house") {
        extraFees = calculateHouseFees(itemPrice);
      } else if (itemType === "student loan") {
        extraFees = calculateStudentLoanFees(itemPrice);
      }

      setBoxes([...boxes, { ...formData, extraFees }]);
      setFormData({ field1: "", field2: "" });
    }
  };

  const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const calculateCarFees = (price) => ({
    salesTax: (price * (randomInRange(5, 10) / 100)).toFixed(2),
    registrationFee: randomInRange(50, 400),
    titleFee: randomInRange(15, 150),
    dealerFee: randomInRange(100, 600),
    loanOriginationFee: randomInRange(100, 500),
    warranty: randomInRange(1000, 3000),
    gapInsurance: randomInRange(400, 700),
    inspectionFee: randomInRange(20, 100),
    destinationCharge: randomInRange(900, 1500),
    miscFees: randomInRange(50, 300),
  });

  const calculateHouseFees = (price) => ({
    propertyTax: (price * (randomInRange(1, 3) / 100)).toFixed(2),
    homeownersInsurance: randomInRange(800, 2500),
    closingCosts: (price * (randomInRange(2, 5) / 100)).toFixed(2),
    homeInspectionFee: randomInRange(300, 600),
    titleInsurance: randomInRange(500, 1500),
    HOAFees: randomInRange(100, 500),
    mortgageOriginationFee: (price * (randomInRange(0.5, 1.5) / 100)).toFixed(2),
  });

  const calculateStudentLoanFees = (loanAmount) => ({
    originationFee: (loanAmount * (randomInRange(1, 5) / 100)).toFixed(2),
    interestOver10Years: (loanAmount * (randomInRange(3, 7) / 100) * 10).toFixed(2),
    latePaymentFees: randomInRange(25, 100),
    consolidationFees: randomInRange(200, 600),
  });

  const calculateTotalCost = (basePrice, fees) => {
    const totalFees = Object.values(fees).reduce((acc, fee) => acc + Number(fee), 0);
    return basePrice + totalFees;
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-center">What if I want to</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Purchase</label>
            <input
              type="text"
              name="field1"
              value={formData.field1}
              onChange={handleChange}
              placeholder="Enter item name (e.g., Car, House, Student Loan)"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Price ($)</label>
            <input
              type="number"
              name="field2"
              value={formData.field2}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Let's see
        </button>
      </form>

      {/* Display Created Boxes */}
      <div className="mt-4 space-y-2">
        {boxes.map((box, index) => (
          <div key={index} className="p-4 border rounded bg-gray-100 shadow-md">
            <p className="font-bold">Name: {box.field1}</p>
            <p>Price: ${box.field2}</p>

            {Object.keys(box.extraFees).length > 0 && (
              <>
                <hr className="my-2" />
                <p className="font-semibold">Additional Fees for {box.field1}:</p>
                <ul className="text-sm text-gray-600">
                  {Object.entries(box.extraFees).map(([key, value]) => (
                    <li key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                      <span>${value}</span>
                    </li>
                  ))}
                </ul>
                <p className="font-bold mt-2 text-gray-800">
                  **Total Cost:** ${calculateTotalCost(Number(box.field2), box.extraFees)}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
