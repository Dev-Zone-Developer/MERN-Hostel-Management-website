import { useNavigate, useLocation } from "react-router-dom"
import { Home, Users, Settings, Calendar, FilePlus, LogOut, X, Bed } from "lucide-react"
import SidebarItem from "./SidebarItem"
import { isAdmin } from "../../components/isAdmin"
import { errorToast, warningToast } from "../../components/Toast"

export default function Sidebar({ open, close }) {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const handleLogout = async () => {
        warningToast("Logging Out Please wait...")
        try {
            const response = await fetch('/auth/logout', {
                method: "POST",
                credentials: 'include', // sends cookies if using them
            });

            if (!response.ok) {
                errorToast("Logout Failed")
                throw new Error('Logout failed')
            };


            // remove token from localStorage
            localStorage.removeItem("cookie");

            // optional: check if user is admin or update state
            const data = await isAdmin();

            if (!data.loggedIn) {
                navigate("/login");
                return;
            }

            if (data.role !== "admin") {
                navigate("/login");
                return;
            }

            navigate("/admin/dashboard");
        } catch (err) {
            console.error(err);
            alert("Logout failed, try again.");
        }


    };

    const menu = [
        { label: "Dashboard", path: "/admin/dashboard", icon: <Home size={20} /> },
        { label: "Booking", path: "/admin/booking", icon: <Calendar size={20} /> },
        { label: "Apply Pass", path: "/admin/apply-pass", icon: <FilePlus size={20} /> },
        // { label: "Users", path: "/admin/users", icon: <Users size={20} /> },
        { label: "Rooms", path: "/admin/manage-rooms", icon: <Bed size={20} /> },
        { label: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
    ]

    return (
        <aside
            className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900/60 backdrop-blur-lg 
        border-r border-slate-700 p-6 transition-transform duration-300
        lg:translate-x-0 lg:block 
        ${open ? "translate-x-0" : "-translate-x-full"}
      `} style={{ zIndex: 50 }}
        >
            {/* Close button mobile */}
            <button
                onClick={close}
                className="lg:hidden absolute top-4 right-4 text-white"
            >
                <X size={26} />
            </button>

            <h1 className="text-white text-2xl font-bold mb-8">Admin Panel</h1>

            <nav className="flex flex-col gap-2 text-gray-300">
                {menu.map(item => (
                    <SidebarItem
                        key={item.path}
                        label={item.label}
                        icon={item.icon}
                        isActive={pathname === item.path}
                        onClick={() => {
                            navigate(item.path)
                            close()
                        }}
                    />
                ))}
            </nav>

            <div className=" mt-auto pt-4 border-t border-slate-700">
                <SidebarItem
                    label="Logout"
                    icon={<LogOut size={20} />}
                    onClick={() => { handleLogout() }}
                />
            </div>
        </aside>
    )
}
