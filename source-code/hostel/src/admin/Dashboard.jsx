import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import { Menu } from "lucide-react"
import { isAdmin } from "../components/isAdmin"

export default function DashboardLayout() {
    const [open, setOpen] = useState(false)
    const [width, setWidth] = useState();
    const navigate = useNavigate()
    async function CheckLogin() {
        const data = await isAdmin()
        if (!data.loggedIn) {
            navigate("/login");
            return;
        }
    }
    CheckLogin()
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        console.log(window.innerWidth)
        window.addEventListener("resize", handleResize);
        // cleanup when component unmounts
        return () => window.removeEventListener("resize", handleResize);
    }, [width]);
    return (
        <div className="flex h-screen overflow-hidden bg-slate-900">

            {/* Mobile top bar */}
            <div className="lg:hidden fixed inset-x-2 top-2.5 z-40 flex items-center justify-between gap-3 p-2 bg-slate-800/80 border border-slate-700 rounded-lg shadow-md backdrop-blur">
                <button
                    onClick={() => setOpen(true)}
                    aria-label="Open menu"
                    className="p-2 rounded-md text-white hover:bg-slate-700/60 transition"
                >
                    <Menu size={28} />
                </button>

                <div className="flex-1 text-center">
                    <h1 className="text-white text-sm font-semibold">Admin Panel</h1>
                </div>


            </div>

            {/* Mobile backdrop when sidebar is open */}
            {open && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <Sidebar open={open} close={() => setOpen(false)} />

            {/* Main content */}
            <main
                className={`flex-1 overflow-y-auto p-6 lg:ml-64 ${width <= 1024 ? "mt-16" : "mt-0"
                    }`}
            >
                <Outlet />
            </main>

        </div>
    )
}
