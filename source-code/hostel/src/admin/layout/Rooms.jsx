import React, { useEffect, useState } from "react";
import { errorToast, successToast, warningToast } from "../../components/Toast";
import { isAdmin } from "../../components/isAdmin";

const AdminRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState("");
    const [roomCapacity, setRoomCapacity] = useState(0);
    const [loading, setLoading] = useState(true)
    const [selectedRoom, setSelectedRoom] = useState(""); // store selected room id
    const [viewRoom, setViewRoom] = useState(null); // room to view
    const [showModal, setShowModal] = useState(false);
    const [roomdetails, setRoomDetails] = useState()

    const [cnic, setCnic] = useState("");
    const [manageUser, setManageUser] = useState()

    const handleCnicChange = (e) => {
        const value = e.target.value.replace(/\s+/g, ""); // remove all spaces
        setCnic(value);
    };
    useEffect(() => {
        if (!cnic.trim()) return;

        const delay = setTimeout(async () => {
            try {
                const res = await fetch('/admin/searchUsers', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ cnic })
                });

                const data = await res.json();

                if (!data.success) {
                    errorToast(data.message || "No user found");
                    return;
                }
                setManageUser(data.data);
                setLoading(false)
                console.log("User found:", data.data);
            } catch (err) {
                console.error(err);
            } finally {
                fetchRooms()
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [cnic]);

    const handleAssignRoom = async () => {
        if (!selectedRoom || !manageUser) return errorToast("Select a room first");

        const roomObj = rooms.find((r) => r.id.toString() === selectedRoom);
        try {
            const res = await fetch("/admin/assign-room", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cnic: manageUser.cnic, room_name: roomObj.room_name, email: manageUser.email }),
            });
            const data = await res.json();
            console.log(data)
            if (data.success) {
                successToast(`${data.message}`);
                setCnic("");
                setManageUser(null);
                setSelectedRoom("");
            } else {
                errorToast(data.message || "Error assigning room");
            }
        } catch (err) {
            console.error(err);
        } finally {
            fetchRooms()
        }
    };


    /// below code is related about to manage Hostel Rooms
    const fetchRooms = async () => {
        const res = await fetch("/admin/rooms");
        const data = await res.json();
        setRooms(data);
        console.log(data)
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleAddRoom = async () => {
        if (!roomName || !roomCapacity) return alert("Enter room name and capacity");

        await fetch("/admin/rooms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room_name: roomName, room_capacity: roomCapacity }),
        });

        setRoomName("");
        setRoomCapacity(2);
        fetchRooms();
    };

    const handleDeleteRoom = async (id) => {
        if (!window.confirm("Delete this room?")) return;
        await fetch(`/admin/rooms/${id}`, { method: "DELETE" });
        fetchRooms();
    };
    const doubleRooms = rooms.filter(r => r.room_capacity === 2);
    const fourthRooms = rooms.filter(r => r.room_capacity === 4);

    const handleViewRoom = async (userId) => {
        try {
            const res = await fetch('/admin/roomdetails', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roomId: userId })
            })
            const data = await res.json()
            setRoomDetails(data)
            console.log(data)
        } catch (error) {
            errorToast("Failed to send request", error)
        }
        const selectedRoom = rooms.find(room => room.id === userId)
        if (!selectedRoom) {
            errorToast("Something went wrong");
            return;
        }
        // console.log(selectedRoom)
        setViewRoom(selectedRoom);
        setShowModal(true);
    };
    const roomRemoved = async (user) => {
        if (!window.confirm(`Are you sure you want to remove ${user.fullname} (${user.cnic})?`)) return;

        try {
            const res = await fetch('/admin/roomremove', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cnic: user.cnic })
            });

            const result = await res.json(); // renamed variable to avoid conflict

            if (result.success) {
                successToast(result.message);
                // Optionally refresh room details after removal
                fetchRooms()
            } else {
                warningToast(result.message);
            }
        } catch (error) {
            console.error(error);
            errorToast("Failed to remove user");
        }
    };


    return (
        <>
            <div className="w-full bg-white">
                <div className="w-full p-6 shadow rounded bg-white">

                    {/* Row 1: CNIC */}
                    <h2 className="text-2xl font-bold text-center mb-3">Manage Students</h2>
                    <div className="mb-4">
                        {
                            manageUser ? (
                                <label className="block mb-1 font-medium">
                                    Student Name: {manageUser?.fullname}
                                </label>
                            ) : (
                                <label className="block mb-1 font-medium">
                                    Enter Student CNIC
                                </label>
                            )
                        }
                        <input
                            type="text"
                            value={cnic}
                            onChange={handleCnicChange}
                            placeholder="Enter CNIC"
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    {/* Row 2: Select */}
                    <div className="mb-4 flex flex-row justify-between gap-1">
                        {manageUser?.room_type === "Double Sharing" ? (
                            <>
                                <div style={{ width: "45%" }}>
                                    <label className="block mb-1 font-medium">Double Sharing</label>
                                    <select className="w-full border p-2 rounded" disabled={loading}
                                        value={selectedRoom}
                                        onChange={(e) => setSelectedRoom(e.target.value)}
                                    >
                                        <option value="">Choose</option>
                                        {doubleRooms.map(room => (
                                            <option key={room.id} value={room.id}>
                                                {room.room_name} ({room.room_filled} / {room.room_capacity})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ width: "45%" }}>
                                    <label className="block mb-1 font-medium">Fourth Sharing</label>
                                    <select className="w-full border p-2 rounded" disabled={loading}
                                        value={selectedRoom}
                                        onChange={(e) => setSelectedRoom(e.target.value)}
                                    >
                                        <option value="">Choose</option>
                                        {fourthRooms.map(room => (
                                            <option key={room.id} value={room.id}>
                                                {room.room_name} ({room.room_filled} / {room.room_capacity})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ width: "45%" }}>
                                    <label className="block mb-1 font-medium">Fourth Sharing</label>
                                    <select className="w-full border p-2 rounded" disabled={loading}
                                        value={selectedRoom}
                                        onChange={(e) => setSelectedRoom(e.target.value)}
                                    >
                                        <option value="">Choose</option>
                                        {fourthRooms.map(room => (
                                            <option key={room.id} value={room.id}>
                                                {room.room_name} ({room.room_filled} / {room.room_capacity})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ width: "45%" }}>
                                    <label className="block mb-1 font-medium">Double Sharing</label>
                                    <select className="w-full border p-2 rounded" disabled={loading}
                                        value={selectedRoom}
                                        onChange={(e) => setSelectedRoom(e.target.value)}
                                    >
                                        <option value="">Choose</option>
                                        {doubleRooms.map(room => (
                                            <option key={room.id} value={room.id}>
                                                {room.room_name} ({room.room_filled} / {room.room_capacity})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}


                    </div>

                    {/* Row 3: Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleAssignRoom}
                            className="px-5 bg-blue-600 text-white p-2 rounded"
                            disabled={loading || !manageUser}
                        >
                            Submit
                        </button>
                    </div>


                </div>
            </div>

            {/* Manage rooms */}
            <div className="p-6 bg-blue-600">
                <h1 className="text-2xl text-white font-bold mb-4">Manage Rooms</h1>

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
                        className="text-white px-4 py-2 rounded "
                        style={{ background: '#8CA7EF' }}
                    >
                        Add Room
                    </button>
                </div>

                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Room Name</th>
                            <th className="px-4 py-2">Full</th>
                            <th className="px-4 py-2">Capacity</th>
                            <th className="px-4 py-2">Actions</th>
                            <th className="px-4 py-2">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room, index) => (
                            <tr key={room.id} className="border-b border-white/20 hover:border-white/20 text-white" >
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{room.room_name}</td>
                                <td className="px-4 py-2">{room.room_filled}</td>
                                <td className="px-4 py-2">{room.room_capacity}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleDeleteRoom(room.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleViewRoom(room.id)}
                                        className="bg-green-500 text-white px-2 py-1 rounded cursor-pointer"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Modal */}
                {showModal && viewRoom && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center" style={{ zIndex: 99 }}>
                        <div className="bg-white p-6 rounded-lg ">
                            <h2 className="text-xl font-bold mb-4">Room Name: {viewRoom?.room_name}</h2>
                            <div className="flex justify-evenly mb-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl font-bold">{viewRoom.room_capacity}</span>
                                    <span className="text-sm text-gray-500">Capacity</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl font-bold">{viewRoom.room_filled}</span>
                                    <span className="text-sm text-gray-500">Occupied</span>
                                </div>
                            </div>

                            <h3 className="font-semibold mt-4 mb-2">Students:</h3>
                            <div className="overflow-x-auto border rounded p-2">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2 border">Full Name</th>
                                            <th className="px-4 py-2 border">CNIC</th>
                                            <th className="px-4 py-2 border">Email</th>
                                            <th className="px-4 py-2 border">Phone</th>
                                            <th className="px-4 py-2 border">Action</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {roomdetails?.users?.map(user => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 border">{user.fullname}</td>

                                                <td className="px-4 py-2 border">{user.cnic}</td>
                                                <td className="px-4 py-2 border">{user.email}</td>
                                                <td className="px-4 py-2 border">{user.phone_number}</td>
                                                <td className="px-4 py-2 border">
                                                    <button
                                                        onClick={() => roomRemoved(user)}
                                                        className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
                                                    >
                                                        Remove user
                                                    </button>
                                                </td>


                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                            <button
                                onClick={() => setShowModal(false)}
                                className="mt-4 px-3 py-1 bg-red-500 text-white rounded cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminRooms;
