import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useCheckLogin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/auth/check-auth", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('cookie')}`
                    },
                    credentials: "include",
                });
                const data = await res.json();
                if (data.loggedIn) {
                    // silently redirect
                    if (data.role == "admin") {
                        navigate("/admin/dashboard", { replace: true });
                    }
                }
            } catch (err) {
                console.error("Failed to check login:", err);
            }
        };

        checkAuth();
    }, [navigate]);

};

export default useCheckLogin;
