import { Users, Calendar, FilePlus, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { errorToast } from "../../components/Toast";

export default function Home() {
    const [response, setRequests] = useState()
    useEffect(() => {
        async function fetchTotalUsers() {
            try {
                const data = await fetch('/information/data');
                const res = await data.json();
                setRequests(res)
                console.log(res)
            } catch (error) {
                errorToast(error)
            }
        }
        fetchTotalUsers()
    }, [])
    return (
        <>
            <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl border border-blue-500/30 text-white">
                <h2 className="text-4xl font-bold">Dashboard</h2>
                <p className="mt-3 text-blue-100 text-lg">Welcome back, Admin.</p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Users" value={response?.total_users ?? 0} icon={<Users size={24} />} />
                <StatCard title="Bookings" value={response?.booking ?? 0} icon={<Calendar size={24} />} />
                <StatCard title="Passes" value={response?.passes ?? 0} icon={<FilePlus size={24} />} />
                <StatCard title="Total Seats" value={response?.total_capacity ?? 0} icon={<Store size={24} />} />
                <StatCard title="Occupied Seats" value={response?.occupied_capacity ?? 0} icon={<Store size={24} />} />
                <StatCard title="Total Rooms" value={response?.rooms ?? 0} icon={<Store size={24} />} />
                <StatCard title="2 Seater Rooms" value={response?.two_seaters ?? 0} icon={<Store size={24} />} />
                <StatCard title="4 Seater Rooms" value={response?.four_seaters ?? 0} icon={<Store size={24} />} />
            </div>
        </>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm">{title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{value}</p>
                </div>
                <div className="text-blue-400">{icon}</div>
            </div>
        </div>
    );
}
