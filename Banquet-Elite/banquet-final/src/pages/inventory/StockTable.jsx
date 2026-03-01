import React from "react";

function daysLeft(date) {
  const diff = new Date(date) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function StockTable({ inventory }) {
  const totalValue = inventory.reduce(
    (sum, i) => sum + i.stock * i.pricePerUnit,
    0
  );

  return (
    <div className="bg-gray-900 p-6 rounded-xl text-white">
      <h2 className="text-xl mb-4">Real-Time Stock Levels</h2>

      <div className="mb-4">
        Stock Value: ₹{totalValue.toLocaleString()}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th>Item</th>
            <th>Branch</th>
            <th>Stock</th>
            <th>Min</th>
            <th>Status</th>
            <th>Expiry</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => {
            const low = item.stock < item.minRequired;
            const expiryWarning = daysLeft(item.expiry) <= 3;

            return (
              <tr key={item._id} className="border-b border-gray-800">
                <td>{item.item}</td>
                <td>{item.branch}</td>
                <td>
                  {item.stock} {item.unit}
                </td>
                <td>{item.minRequired}</td>
                <td>
                  {low ? "⚠ Low Stock" : "OK"}
                </td>
                <td className={expiryWarning ? "text-red-400" : ""}>
                  {new Date(item.expiry).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}