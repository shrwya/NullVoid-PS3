import React from "react";

export default function SupplierAnalytics({ suppliers }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl text-white">
      <h2 className="text-xl mb-4">Supplier Performance</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th>Name</th>
            <th>Punctuality</th>
            <th>Quality</th>
            <th>Price Trend</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s._id} className="border-b border-gray-800">
              <td>{s.name}</td>
              <td>{s.punctualityScore}%</td>
              <td>{s.qualityScore}%</td>
              <td>{s.avgPriceTrend}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}