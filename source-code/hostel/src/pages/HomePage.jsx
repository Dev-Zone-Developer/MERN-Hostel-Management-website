import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const HomePage = () => {
    const [scroll, setScroll] = useState(false)
    const [showButton, setShowButton] = useState(false)
    const { hash } = useLocation();
    const [roomPrices, setRoomPrices] = useState({ double: "", fourth: "" })

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
    }, [])


    useEffect(() => {
        if (hash) {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [hash]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setScroll(true)
            } else {
                setScroll(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (scroll) {
            setShowButton(true)
        } else {
            // Add delay to let animation finish before unmount
            const timeout = setTimeout(() => setShowButton(false), 300)
            return () => clearTimeout(timeout)
        }
    }, [scroll])
    const scrollToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // smooth scroll effect
        })
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-blue-100 text-gray-800">
            {showButton && (
                <div
                    className={`fixed bottom-5 right-5 z-50 transition-all duration-300 ${scroll ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                >
                    <a onClick={scrollToTop} style={{ cursor: 'pointer' }}>
                        <img className="w-12" src="/top.png" alt="Top" />
                    </a>
                </div>
            )}
            <header className="flex items-center justify-between px-8 py-3 sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
                <h1 className="text-2xl font-bold text-blue-700">Boys Hostel</h1>

                <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
                    <li><a href="#about" className="hover:text-blue-600 transition">About</a></li>
                    <li><a href="#rooms" className="hover:text-blue-600 transition">Rooms</a></li>
                    <li><a href="#facilities" className="hover:text-blue-600 transition">Facilities</a></li>
                    <li><a href="#gallery" className="hover:text-blue-600 transition">Gallery</a></li>
                    <li> <a href="#contact" className="hover:text-blue-600 transition">Contact</a></li>

                </ul>



                <Link
                    to="/login"
                    className="px-4 py-2 bg-[#003262] text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Login
                </Link>
            </header>
            <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20" id='home'>
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="md:w-1/2"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 leading-snug">
                        Comfortable & Affordable Living for Students
                    </h2>
                    <p className="text-gray-600 text-lg mb-6">
                        BlueNest Boys Hostel offers safe, peaceful, and fully furnished rooms for university students.
                        Enjoy comfort, Wi-Fi, delicious meals, and a perfect study environment.
                    </p>
                    <div className="flex flex-wrap gap-3.5">
                        <Link
                            to="/booking"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Book Your Room Now
                        </Link>
                        <Link
                            to="/apply-pass"
                            className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-medium transition-all duration-300 ease-in-out border-2 border-blue-600 hover:bg-blue-700 hover:text-white"
                        >
                            Apply for Pass
                        </Link>

                    </div>
                </motion.div>

                <motion.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    src="/hostel-building.png"
                    alt="Hostel building"
                    className="md:w-1/2 w-full mt-10 md:mt-0 rounded-2xl shadow-lg"
                />
            </section>
            <section id="about" className="px-10 py-16 bg-white text-center">
                <h3 className="text-3xl font-bold text-blue-700 mb-8">About Us</h3>

                <div className="flex flex-wrap justify-center items-start font-medium gap-8 flex-row-reverse">
                    <p className="max-w-md text-gray-600 text-left">
                        Established in 2025, Boys Hostel provides premium accommodation for students.
                        Located near the university, our hostel ensures comfort, security, and an ideal study environment.
                    </p>

                    <div className="w-full md:w-2/5 rounded-lg overflow-hidden shadow-md border border-gray-200">
                        <iframe
                            title="hostel-location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d836.8240650909313!2d73.11965003115364!3d30.650352947116506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3922b7b3066c8df3%3A0xf35aae1c2f9ec35b!2sGC%20University%20Faisalabad%20Sahiwal%20Campus!5e1!3m2!1sen!2s!4v1762858210923!5m2!1sen!2s"
                            width="100%"
                            height="350"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>
            {/* Rooms Section */}
            <section id="rooms" className="px-10 py-16 bg-blue-50 text-center">
                <h3 className="text-3xl font-bold text-blue-700 mb-10">Our Rooms</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    {[

                        { title: "Double Sharing", price: `PKR ${parseFloat(roomPrices.double).toLocaleString()} / month`, img: "/room-1.png" },
                        { title: "Fourth Sharing", price: `PKR ${parseFloat(roomPrices.fourth).toLocaleString()} / month`, img: "/room-1.png" },
                    ].map((room, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.03 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <img src={room.img} alt={room.title} className="w-full h-52 object-cover" />
                            <div className="p-5">
                                <h4 className="text-xl font-semibold text-blue-700">{room.title}</h4>
                                <p className="text-gray-600 mt-1">{room.price}</p>
                                <Link
                                    href="/roombooking"
                                    className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Book Now
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Facilities Section */}
            <section id="facilities" className="px-10 py-16 bg-white text-center">
                <h3 className="text-3xl font-bold text-blue-700 mb-10">Facilities We Offer</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    {[

                        { icon: "📶", title: "Free Wi-Fi", desc: "High-speed internet for study and entertainment." },
                        { icon: "🛡️", title: "24/7 Security", desc: "CCTV monitored secure premises." },
                        { icon: "🚿", title: "Hot Water", desc: "Hot & cold water supply all day." },
                        { icon: "🪑", title: "Study Area", desc: "Quiet and comfortable study space." },
                    ].map((f, i) => (
                        <div
                            key={i}
                            className="p-6 bg-blue-50 rounded-xl shadow-sm hover:shadow-md transition"
                        >
                            <div className="text-4xl mb-3">{f.icon}</div>
                            <h4 className="text-lg font-semibold text-blue-700">{f.title}</h4>
                            <p className="text-gray-600 mt-2">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="px-10 py-16 bg-blue-50 text-center">
                <h3 className="text-3xl font-bold text-blue-700 mb-10">Gallery</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {["/room-1.png", "/room-1.png", "/room-1.png", "/room-1.png", "/room-1.png", "/room-1.png"].map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt={`Gallery ${i + 1}`}
                            className="rounded-xl shadow-md hover:scale-105 transition"
                        />
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="px-10 py-16 bg-white text-center">
                <h3 className="text-3xl font-bold text-blue-700 mb-6">Contact Us</h3>
                <p className="text-gray-600 mb-6">
                    📍  <a
                        href="https://www.google.com/maps/search/?api=1&query=Near+University+Road,+Sahiwal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-600"
                        style={{ textDecoration: 'none' }}
                    >
                        Near University Road, Sahiwal
                    </a>  | 📞
                    <a href="tel:+923001234567">0300-1234567</a> | ✉️
                    <a href="mailto:info@bluenesthostel.com">info@bluenesthostel.com</a>
                </p>
                <Link
                    to="/booking"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Apply for Room
                </Link>
            </section>
            <footer className="bg-blue-700 text-white text-center py-4">
                © {new Date().getFullYear()} Boys Hostel | Designed by Muhammad Nasir | Backend by <a href="https://www.tiktok.com/@abidhussaingcuf" target='_blank'>Muhammad Abid Hussain</a>
            </footer>
        </div>
    )
}

export default HomePage