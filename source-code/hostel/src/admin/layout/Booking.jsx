import React, { useEffect, useState } from 'react';

const Booking = () => {
    const [search, setSearch] = useState('');
    const [bookings, setBookings] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchData = async () => {
        try {
            const res = await fetch('/admin/bookings'); // your API endpoint
            const data = await res.json();
            setBookings(data);
            setFiltered(data);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {

        const delay = setTimeout(async () => {
            if (!search || search.trim() === '') {
                fetchData();
                return;
            }
            try {
                const res = await fetch('/admin/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ search }),
                });
                const data = await res.json();
                setBookings(data);
                setFiltered(data);
            } catch (err) {
                console.error('Error searching bookings:', err);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    const handleStatusClick = (booking) => {
        setSelectedBooking(booking);
        setModalOpen(true);
    };

    const handleDecision = async (decision) => {
        if (!selectedBooking) return;

        try {
            const res = await fetch('/admin/update-booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: selectedBooking.email, // or any unique field
                    status: decision,
                }),
            });

            const data = await res.json();
            console.log('Update response:', data);

            fetchData();
            setModalOpen(false);
            setSelectedBooking(null);
        } catch (err) {
            console.error('Error updating booking:', err);
        }
    };

    return (
        <div className="p-2">
            <div className="bg-linear-to-r backdrop-blur-xl from-blue-600 to-blue-800 shadow-2xl rounded-2xl border border-blue-500/30 text-white p-4 sm:p-6 md:p-8">
                <h1 className="text-xl sm:text-4xl font-bold mb-6 sm:mb-8 text-white">
                    Booking Page
                </h1>

                {/* Search Field */}
                <div className="mb-4 sm:mb-6">
                    <input
                        type="text"
                        placeholder="Search by name, email, cnic(without dashes) or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/50 focus:bg-white/80 outline-none border border-white/40 shadow-inner placeholder:text-blue-800 text-blue-700 transition-all duration-200"
                    />
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] border-collapse text-sm text-white">
                        <thead>
                            <tr className="bg-white/20 text-blue-200 text-left">
                                <th className="py-2 sm:py-3 px-2 sm:px-4">ID</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4">Full Name</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4">Email</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4">Phone</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4">CNIC</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4">Room Type</th>
                                {/* <th className="py-2 sm:py-3 px-2 sm:px-4">Price</th> */}
                                <th className="py-2 sm:py-3 px-2 sm:px-4">Message</th>
                                {/* <th className="py-2 sm:py-3 px-2 sm:px-4">Status</th> */}
                                {/* <th className="py-2 sm:py-3 px-2 sm:px-4">Date</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map((booking, index) => (
                                    <tr
                                        key={booking.id}
                                        className={
                                            booking.blocked === "blocked"
                                                ? "border-b border-red-500 bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                                                : "border-b border-white/20 hover:bg-white/20 transition-all"
                                        }
                                    >
                                        <td className="py-1 sm:py-3 px-1 sm:px-4">{index + 1}</td>
                                        <td className="py-1 sm:py-3 px-1 sm:px-4">{booking.fullname}</td>
                                        <td className="py-1 sm:py-3 px-1 sm:px-4">{booking.email}</td>
                                        <td className="py-1 sm:py-3 px-1 sm:px-4">{booking.phone_number}</td>
                                        <td className="py-1 sm:py-3 px-1 sm:px-4">{booking.cnic}</td>
                                        <td className="py-1 sm:py-3 px-1 sm:px-4">{booking.room_type}<br /> {booking.price}</td>
                                        <td className="py-1 sm:py-3 px-1 sm:px-4">{booking.message}</td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="py-6 text-center text-slate-300 italic">
                                        No bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {modalOpen && selectedBooking && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-lg text-slate-800">
                            <h2 className="text-xl font-bold mb-4">
                                Approve or Reject Booking
                            </h2>
                            <p className="mb-6">
                                Email: <span className="font-mono">{selectedBooking.email}</span>
                            </p>
                            <div className="flex justify-between gap-4">
                                <button
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium"
                                    onClick={() => handleDecision('approved')}
                                >
                                    Approve
                                </button>
                                <button
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium"
                                    onClick={() => handleDecision('rejected')}
                                >
                                    Reject
                                </button>
                            </div>
                            <button
                                className="mt-4 w-full text-blue-700 underline"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Booking;
