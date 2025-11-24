import React, { useEffect, useState } from 'react';
import { successToast } from '../../components/Toast';

const ApplyPass = () => {
    const [search, setSearch] = useState('');
    const [requests, setRequests] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const fetchData = async () => {
        try {
            const res = await fetch('/admin/applypass');
            const data = await res.json();
            setRequests(data);
            setFiltered(data);
        } catch (err) {
            console.error('Error fetching data:', err);
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
                const res = await fetch('/admin/applypass', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ search }),
                });
                const data = await res.json();
                setRequests(data);
                setFiltered(data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [search]);

    const handleStatusClick = (request) => {
        setSelectedRequest(request);
        setModalOpen(true);
    };

    const handleDecision = async (decision) => {
        if (!selectedRequest) return;
        setLoading(true)

        try {
            const res = await fetch('/admin/update-pass', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roll_number: selectedRequest.roll_number,
                    status: decision,
                }),
            });

            const data = await res.json();
            console.log('Update response:', data);
            successToast(data.message)

            // Refresh the data
            fetchData();

            // Close modal
            setModalOpen(false);
            setSelectedRequest(null);
        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setLoading(false)
        }
    };
    const blockedUser = async () => {
        if (!selectedRequest) return;
        setLoading(true)
        alert(`Are you sure to block user : ${selectedRequest.roll_number}`)
        try {
            const res = await fetch('/admin/update-pass', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roll_number: selectedRequest.roll_number,
                    blockedUser: true
                }),
            });

            const data = await res.json();
            handleDecision('rejected')
            console.log('Update response:', data);

            // Refresh the data
            fetchData();

            // Close modal
            setModalOpen(false);
            setSelectedRequest(null);
        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setLoading(false)
        }
    };
    const unblockUser = async () => {
        if (!selectedRequest) return;
        setLoading(true)
        alert(`Are you sure to unblock user : ${selectedRequest.roll_number}`)
        try {
            const res = await fetch('/admin/update-pass', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roll_number: selectedRequest.roll_number,
                    unblockedUser: true
                }),
            });

            const data = await res.json();
            console.log('Update response:', data);

            // Refresh the data
            fetchData();

            // Close modal
            setModalOpen(false);
            setSelectedRequest(null);
        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="p-2 sm:p-6 md:p-8">
            <div className="bg-linear-to-r backdrop-blur-xl from-blue-600 to-blue-800 shadow-2xl rounded-2xl border border-blue-500/30 text-white p-4 sm:p-6 md:p-8">
                <h1 className="text-xl sm:text-4xl font-bold mb-6 sm:mb-8 text-white">
                    Pass Approval Page
                </h1>

                {/* Search Field */}
                <div className="mb-4 sm:mb-6">
                    <input
                        type="text"
                        placeholder="Search by name or CNIC..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/50 focus:bg-white/80 outline-none border border-white/40 shadow-inner placeholder:text-blue-800 text-blue-700 transition-all duration-200"
                    />
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] border-collapse text-sm text-white">
                        <thead>
                            <tr className="bg-white/20 text-blue-200 text-left">
                                <th className="py-2 sm:py-3 px-2 sm:px-4">ID</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4">Full Name</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4">Father Name</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4">CNIC</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4">Reason</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4">Status</th>
                                <th className="py-2 sm:py-3 px-2 sm:px-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map((req, index) => (
                                    <tr key={req.id} className="border-b border-white/20 hover:bg-white/20 transition-all">
                                        {/* Sequential ID */}
                                        <td className="py-1 sm:py-3 px-1 sm:px-4">{index + 1}</td>
                                        <td className="py-1 sm:py-3 px-1 sm:px-4">{req.fullname}</td>
                                        <td className="py-1 sm:py-3 px-1 sm:px-4">{req.father_name}</td>
                                        <td className="py-1 sm:py-3 px-1 sm:px-4">{req.roll_number}</td>
                                        <td className="py-1 sm:py-3 px-1 sm:px-4">{req.reason}</td>
                                        <td className="py-1 sm:py-3 px-1 sm:px-4">
                                            <button
                                                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium cursor-pointer ${req.status === 'approved'
                                                    ? 'bg-green-200/70 text-green-800'
                                                    : req.status === 'rejected'
                                                        ? 'bg-red-200/70 text-red-800'
                                                        : 'bg-yellow-200/70 text-yellow-800'
                                                    }`}
                                                onClick={() => handleStatusClick(req)}
                                            >
                                                {req.status}
                                            </button>
                                        </td>
                                        <td className="py-1 sm:py-3 px-1 sm:px-4">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-6 text-center text-slate-300 italic">
                                        No requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

                {/* Modal */}
                {modalOpen && selectedRequest && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-lg text-slate-800">
                            <h2 className="text-xl font-bold mb-4">
                                Approve or Reject Pass
                            </h2>
                            <p className="mb-6">
                                CNIC: <span className="font-mono">{selectedRequest.roll_number}</span>
                            </p>
                            <div className="flex justify-between gap-4">
                                <button
                                    disabled={loading}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium"
                                    onClick={() => handleDecision('approved')}
                                >
                                    Approve
                                </button>
                                <button
                                    disabled={loading}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium"
                                    onClick={() => handleDecision('rejected')}
                                >
                                    Reject
                                </button>
                            </div>
                            <button
                                disabled={loading}
                                className="w-full mt-3.5 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-medium"
                                onClick={() => blockedUser()}
                            >
                                Block User
                            </button>
                            <button
                                disabled={loading}
                                className="w-full mt-3.5 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium"
                                onClick={() => unblockUser()}
                            >
                                Unblock User
                            </button>
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

export default ApplyPass;
