import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { errorToast, successToast } from "../components/Toast";
import useCheckLogin from "../components/isLoggedIn";

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [logged, setLogged] = useState("")

    //Check user login or not
    useCheckLogin();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setLogged("");

        try {
            const res = await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(form),
            });

            const data = await res.json();
            console.log(data)
            if (data.success) {
                setLogged("Successfully Logged In. Redirecting...")
                successToast("Successfully Logged In. Redirecting...")
                localStorage.setItem('cookie', data.cookie)
                setTimeout(() => {
                    window.location.href = "/admin/dashboard"
                }, 2000);
            } else {
                errorToast(data.message)
            }
        } catch (err) {
            // setError("Something went wrong");
            errorToast("Something went wrong")
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-linear-to-b from-gray-100 to-white flex justify-center items-center px-4">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
            >
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                    Login
                </h1>

                {error && (
                    <p className="bg-red-100 text-red-600 text-sm text-center py-2 rounded mb-3">
                        {error}
                    </p>
                )}
                {logged && (
                    <p className="bg-green-100 text-white-600 text-sm text-center py-2 rounded mb-3">
                        {logged}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <div className="flex items-center justify-between font-semibold text-blue-500">
                        <Link to="/">Forgot Password?</Link>
                        <Link to="/">Back to Home</Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default Login