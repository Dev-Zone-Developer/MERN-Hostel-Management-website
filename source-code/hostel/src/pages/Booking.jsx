import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { warningToast } from "../components/Toast";
import { useRef } from "react";

export default function Booking() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        cnic: "",
        roomType: "",
        message: "",
        price: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [output, setOutput] = useState(0);
    const [roomprices, setroomPrices] = useState(null)
    const toastShown = useRef(false);

    const getroomPrices = async () => {
        try {
            const res = await fetch('/user/room-prices');
            const data = await res.json();
            setroomPrices(data)
        } catch (error) {
            if (!toastShown.current) {
                warningToast('Failed to connect with server');
                toastShown.current = true;
            }
            console.error("Failed to fetch room prices:", error);
            setroomPrices([]);
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Allow only alphabets and spaces for the name field
        if (name === "name") {
            if (/^[A-Za-z\s]*$/.test(value)) {
                setForm({ ...form, [name]: value });
            }
            return;
        }

        // Allow only digits for phone and CNIC fields
        if (name === "phone") {
            if (/^\d*$/.test(value)) {
                setForm({ ...form, [name]: value });
            }
            return;
        }

        // CNIC formatting (#####-#######-#)
        if (name === "cnic") {
            let cnicValue = value.replace(/\D/g, ""); // remove non-digits
            if (cnicValue.length > 5 && cnicValue.length <= 12)
                cnicValue = cnicValue.replace(/^(\d{5})(\d+)/, "$1-$2");
            if (cnicValue.length > 12)
                cnicValue = cnicValue.replace(/^(\d{5})(\d{7})(\d{0,1}).*/, "$1-$2-$3");

            setForm({ ...form, [name]: cnicValue });
            return;
        }

        // Set Prices For Rooms

        if (name === "roomType") {
            let roomPrice = "";

            if (roomprices && roomprices.length > 0) {
                // Match the selected room type with backend data
                const selectedRoom = roomprices.find(
                    (room) =>
                        (room.room_type === "2-person" && value === "Double Sharing") ||
                        (room.room_type === "4-person" && value === "Fourth Sharing")
                );
                if (selectedRoom) roomPrice = selectedRoom.price;
            }

            setForm({ ...form, roomType: value, price: roomPrice });
            return;
        }


        setForm({ ...form, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !form.name ||
            !form.email ||
            !form.phone ||
            !form.cnic ||
            !form.roomType ||
            !form.price
        ) {
            warningToast("Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/user/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            console.log(form)
            const data = await res.json();
            console.log("API Response:", data);

            if (data.success) {
                setOutput(1);
                setSuccess(true);
                setForm({ name: "", email: "", phone: "", roomType: "", message: "" });
            }
            if (data.error) {
                setOutput(2);
                setSuccess(true);
                setForm({ name: "", email: "", phone: "", roomType: "", message: "" });
            }

        } catch (err) {
            console.error("Error:", err);
            alert("Failed to connect with Server")
        } finally {
            setLoading(false);
        }
    };
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // smooth scroll effect
        })
    }
    useEffect(() => {
        scrollToTop()
        getroomPrices()
    }, [])

    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-16 px-6" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-blue-700 mb-6 text-center"
                >
                    Book a Room
                </motion.h1>

                {!success ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}

                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={handleChange}

                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <input
                            type="text"
                            name="cnic"
                            placeholder="CNIC Number"
                            value={form.cnic}
                            onChange={handleChange}

                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                        />

                        <select
                            name="roomType"
                            value={form.roomType}
                            onChange={handleChange}

                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                        >
                            <option value="" disabled>Select Room Type</option>

                            {roomprices &&
                                roomprices.map((room) => (
                                    <option key={room.id} value={room.room_type === "2-person" ? "Double Sharing" : "Fourth Sharing"}>
                                        {room.room_type === "2-person" ? "Double Sharing" : room.room_type === "4-person" ? "Fourth Sharing" : ""}
                                    </option>
                                ))}
                        </select>

                        <input
                            name="price"
                            placeholder="Price"
                            value={"Rs. " + form.price}
                            onChange={handleChange}
                            readOnly
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <textarea
                            name="message"
                            placeholder="Additional Message (optional)"
                            value={form.message}
                            onChange={handleChange}
                            rows="3"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                        >
                            {loading ? "Submitting..." : "Submit Booking"}
                        </button>
                    </form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center font-semibold text-lg"
                    >
                        {output == 1 && (
                            <p className="text-green-600">🎉 Your booking request has been submitted successfully!
                                <br />
                                We will contact you shortly.</p>
                        )}
                        {output == 2 && (
                            <p className="text-red-500">Booking Failed</p>
                        )}

                    </motion.div>
                )}
            </div>
        </div>
    );
}
