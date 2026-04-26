"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");

  const { data: bugs, refetch } = api.post.getAllBugs.useQuery();

  const createBug = api.post.createBug.useMutation({
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setPriority("Low");
      void refetch();
    },
  });

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        🐛 Bug Tracker
      </h1>

      {/* Bug Form */}
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Report a Bug</h2>
        <input
          type="text"
          placeholder="Bug title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
        />
        <textarea
          placeholder="Bug description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
          rows={4}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
        <button
          onClick={() => createBug.mutate({ title, description, priority })}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold"
        >
          {createBug.isPending ? "Submitting..." : "Submit Bug"}
        </button>
      </div>

      {/* Bug List */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Bug List</h2>
        {bugs?.map((bug) => (
          <div key={bug.id} className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">{bug.title}</h3>
              <span className={`px-3 py-1 rounded text-sm ${
                bug.priority === "Critical" ? "bg-red-600" :
                bug.priority === "High" ? "bg-orange-600" :
                bug.priority === "Medium" ? "bg-yellow-600" :
                "bg-green-600"
              }`}>
                {bug.priority}
              </span>
            </div>
            <p className="text-gray-400 mt-2">{bug.description}</p>
            <span className="text-yellow-400 text-sm">Status: {bug.status}</span>
          </div>
        ))}
        {bugs?.length === 0 && (
          <p className="text-gray-400 text-center">No bugs reported yet!</p>
        )}
      </div>
    </main>
  );
}