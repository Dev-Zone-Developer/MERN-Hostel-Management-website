import React, { useEffect, useState } from "react";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [roomCapacity, setRoomCapacity] = useState(2);
  const [cnic, setCnic] = useState("");
  const [assignRoomName, setAssignRoomName] = useState("");

  const fetchRooms = async () => {
    try {
      const res = await fetch("/admin/rooms");
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Add Room
  const handleAddRoom = async () => {
    if (!roomName || !roomCapacity) return alert("Enter room details");

    try {
      await fetch("/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_name: roomName, room_capacity: roomCapacity }),
      });
      setRoomName("");
      setRoomCapacity(2);
      fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Room
  const handleDeleteRoom = async (id) => {
    try {
      await fetch(`/admin/rooms/${id}`, { method: "DELETE" });
      fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  // Assign room to user
  const handleAssignRoom = async () => {
    if (!cnic || !assignRoomName) return alert("Enter CNIC and Room Name");

    try {
      const res = await fetch("/admin/assign-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnic, room_name: assignRoomName }),
      });
      const data = await res.json();
      alert(data.message);
      setCnic("");
      setAssignRoomName("");
      fetchRooms();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-blue-600 min-h-screen">
      <h1 className="text-2xl text-white font-bold mb-4">Manage Students & Rooms</h1>

      {/* Add Room */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="px-3 py-2 border rounded border-white placeholder:text-slate-300 text-white"
        />
        <input
          type="number"
          min="1"
          placeholder="Capacity"
          value={roomCapacity}
          onChange={(e) => setRoomCapacity(Number(e.target.value))}
          className="px-3 py-2 border rounded w-30 border-white placeholder:text-slate-300 text-white"
        />
        <button
          onClick={handleAddRoom}
          className="text-white px-4 py-2 rounded"
          style={{ background: "#8CA7EF" }}
        >
          Add Room
        </button>
      </div>

      {/* Assign Room */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="User CNIC"
          value={cnic}
          onChange={(e) => setCnic(e.target.value)}
          className="px-3 py-2 border rounded border-white placeholder:text-slate-300 text-white"
        />
        <input
          type="text"
          placeholder="Room Name"
          value={assignRoomName}
          onChange={(e) => setAssignRoomName(e.target.value)}
          className="px-3 py-2 border rounded border-white placeholder:text-slate-300 text-white"
        />
        <button
          onClick={handleAssignRoom}
          className="text-white px-4 py-2 rounded"
          style={{ background: "#8CA7EF" }}
        >
          Assign Room
        </button>
      </div>

      {/* Rooms Table */}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-200 text-blue-800">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Room Name</th>
            <th className="px-4 py-2">Filled</th>
            <th className="px-4 py-2">Capacity</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr
              key={room.id}
              className="border-b border-white/20 hover:border-white/20 text-white"
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{room.room_name}</td>
              <td className="px-4 py-2">{room.room_filled}</td>
              <td className="px-4 py-2">{room.room_capacity}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDeleteRoom(room.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageRooms;
