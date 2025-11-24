import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { errorToast } from '../components/Toast';

const PassApply = () => {
    const [formData, setFormData] = useState({
        name: "",
        fatherName: "",
        cnic: "",
        reason: ""
    });
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false);
    const [output, setOutput] = useState(0);
    const [response, setResponse] = useState(null)

    const handleChanges = (e) => {
        const { name, value } = e.target

        // Allow only alphabets and spaces for the Name and Father Name field
        if (name === "name" || name === "fatherName") {
            if (/^[A-Za-z\s]*$/.test(value)) {
                setFormData({ ...formData, [name]: value });
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

            setFormData({ ...formData, [name]: cnicValue });
            return;
        }
        setFormData({ ...formData, [name]: value });
    }
    const sumbitPass = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const res = await fetch('/user/applypass', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            console.log(JSON.stringify(formData))
            const data = await res.json();
            setResponse(data);
            console.log("API Response :", data);
            if (data.success) {
                setOutput(1);
                setSuccess(true);
                setFormData({
                    name: "",
                    fatherName: "",
                    cnic: "",
                    reason: ""
                })
            }
            if (data.err) {
                setOutput(2);
                errorToast(data.message)
                setSuccess(true);
                setFormData({
                    name: "",
                    fatherName: "",
                    cnic: "",
                    reason: ""
                })
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect with Server")
        } finally {
            setLoading(false)
        }

    }
    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-16 px-6">
            <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-blue-700 mb-6 text-center"
                >
                    Apply For Pass
                </motion.h1>
                {!success ? (
                    <form onSubmit={sumbitPass} className="space-y-5">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChanges}
                            placeholder="Full Name"
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <input
                            type="text"
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleChanges}
                            placeholder="Father Name"
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <input
                            type="text"
                            name="cnic"
                            value={formData.cnic}
                            onChange={handleChanges}
                            placeholder="Enter CNIC"
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                        <textarea
                            name="reason"
                            placeholder="Reason for Leaving"
                            value={formData.reason}
                            onChange={handleChanges}
                            rows="3"
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                        >
                            {loading ? "Submitting..." : "Submit Booking"}
                            {/* Submit Booking */}
                        </button>
                    </form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center font-semibold text-lg"
                    >
                        {output == 1 && (
                            <p className="text-green-600">🎉 Your Pass request has been submitted successfully!
                                <br />
                                You will received notification or email shortly.</p>
                        )}
                        {output == 2 && (
                            <p className="text-red-500">{response.message}</p>
                        )}

                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default PassApply