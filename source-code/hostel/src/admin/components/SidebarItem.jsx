export default function SidebarItem({ icon, label, isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                }`}
        >
            <span>{icon}</span>
            <span>{label}</span>
        </button>
    )
}
