import React, { useState, useEffect } from "react";
import { errorToast, successToast, warningToast } from "../../components/Toast";

/*
    AdminSettings - UI for viewing and updating admin-related settings:
    - view/update admin email
    - change password (with confirmation)
    - view/edit room prices (list of room types + price)
    - simple loading and success/error feedback
    Note: replace the API endpoints below with your real backend routes.
*/

export default function Settings() {
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [roomPrices, setRoomPrices] = useState({ double: "", fourth: "" });
    const [passwords, setPasswords] = useState({ next: "", confirm: "" });
    const [rentloading, setrentloading] = useState(false)

    async function getPrices() {
        try {
            const data = await fetch('/admin/rentprices')
            const jsondata = await data.json()
            if (!jsondata.error) {


                const newPrices = { double: "", fourth: "" };

                jsondata.forEach(room => {
                    if (room.room_type === "2-person") newPrices.double = room.price;
                    if (room.room_type === "4-person") newPrices.fourth = room.price;
                });

                setRoomPrices(newPrices);

            }
        } catch (error) {
            warningToast(error)
        }
    }
    useEffect(() => {

        getPrices()
        console.log(roomPrices)
    }, [])
    const updateEmail = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch('/admin/update-email', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email
                })
            })
            const data = await res.json()
            console.log(data)
            if (data.success) {
                successToast(data.message)
            } else {
                warningToast(data.message)
            }

        } catch (error) {
            errorToast(error)
        } finally {
            setSaving(false)
        }
    }
    const updatePassword = async (e) => {
        e.preventDefault()

        if (!passwords.next || !passwords.confirm) {
            warningToast("Both fields are required")
            return
        }
        if (passwords.next !== passwords.confirm) {
            warningToast("Passwords do not match");
            return;
        }
        setLoading(true)
        try {
            const sendpassword = await fetch('/admin/update-passwords', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    password: passwords.next
                })
            })
            const response = await sendpassword.json()
            console.log(response)
            if (response.success) {
                successToast(response.message)
            } else {
                warningToast(response.message)
            }

        } catch (error) {
            errorToast(error)
        } finally {
            setLoading(false)
        }
    }

    const updateRent = async (e) => {
        e.preventDefault()


        setrentloading(true)
        try {
            const sendprices = await fetch('/admin/rentprices', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(roomPrices)
            })
            const responseprices = await sendprices.json()
            console.log(responseprices)
            if (responseprices.success) {
                successToast(responseprices.message)
                getPrices()
            } else {
                warningToast(responseprices.message)
            }

        } catch (error) {
            errorToast(error)
        } finally {
            setrentloading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 text-gray-100">
            <h2 className="text-2xl font-semibold">Admin Settings</h2>
            <section className="bg-gray-800 p-4 rounded shadow-sm">
                <h3 className="font-medium mb-2">Account</h3>

                <form className="space-y-3" onSubmit={updateEmail}>
                    <label className="block">
                        <div className="text-sm text-gray-300 mb-1">Email</div>
                        <input
                            type="email"
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Update Email"}
                        </button>
                    </div>
                </form>
            </section>

            <section className="bg-gray-800 p-4 rounded shadow-sm">
                <h3 className="font-medium mb-2">Change Password</h3>
                <form className="space-y-3" onSubmit={updatePassword}>


                    <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                            <div className="text-sm text-gray-300 mb-1">New Password</div>
                            <input
                                type="password"
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                                value={passwords.next}
                                onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                                required
                                minLength={6}
                            />
                        </label>

                        <label className="block">
                            <div className="text-sm text-gray-300 mb-1">Confirm Password</div>
                            <input
                                type="password"
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                                required
                                minLength={6}
                            />
                        </label>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded disabled:opacity-60"
                        >
                            {loading ? "Updating..." : "Change Password"}
                        </button>
                    </div>
                </form>
            </section>

            <section className="bg-gray-800 p-4 rounded shadow-sm">
                <h3 className="font-medium mb-2">Manage Room Prices </h3>
                <form className="space-y-3" onSubmit={updateRent}>


                    <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                            <div className="text-sm text-gray-300 mb-1">For 2 Persons</div>
                            <input
                                type="number"
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                                value={parseFloat(roomPrices.double)}
                                onChange={(e) => setRoomPrices((p) => ({ ...p, double: e.target.value }))}

                            />
                        </label>

                        <label className="block">
                            <div className="text-sm text-gray-300 mb-1">For 4 Persons</div>
                            <input
                                type="number"
                                className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                                value={parseFloat(roomPrices.fourth)}
                                onChange={(e) => setRoomPrices((p) => ({ ...p, fourth: e.target.value }))}
                            />
                        </label>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={rentloading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-60"
                        >
                            {rentloading ? "Updating..." : "Change Prices"}
                        </button>
                    </div>
                </form>
            </section>


        </div>
    );
}