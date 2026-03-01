import React from "react";

export default function CrossBranch({ inventory, refresh }) {

  function findTransfers() {
    const grouped = {};

    inventory.forEach((i) => {
      if (!grouped[i.item]) grouped[i.item] = [];
      grouped[i.item].push(i);
    });

    const suggestions = [];

    Object.values(grouped).forEach((items) => {
      const low = items.find((i) => i.stock < i.minRequired);
      const surplus = items.find((i) => i.stock > i.minRequired * 2);

      if (low && surplus) {
        suggestions.push({
          item: low.item,
          from: surplus.branch,
          to: low.branch,
          quantity: low.minRequired - low.stock,
        });
      }
    });

    return suggestions;
  }

  async function approveTransfer(t) {
    await fetch("http://10.130.121.25:8000/transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...t,
        status: "Completed",
        date: new Date(),
      }),
    });

    refresh();
  }

  const suggestions = findTransfers();

  return (
    <div className="bg-gray-900 p-6 rounded-xl text-white">
      <h2 className="text-xl mb-4">Smart Transfer Alerts</h2>

      {suggestions.length === 0 && <div>No transfers needed.</div>}

      {suggestions.map((s, i) => (
        <div key={i} className="bg-gray-800 p-4 rounded mb-3">
          {s.item}: {s.from} ➜ {s.to} ({s.quantity})
          <button
            className="ml-4 bg-yellow-500 px-3 py-1 rounded"
            onClick={() => approveTransfer(s)}
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
}