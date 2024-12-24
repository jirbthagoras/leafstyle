"use client";
import { useState } from "react";
import { X, ArrowRight } from "lucide-react"; // Import ikon dari Lucide React

const EventPage = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);

    const events = [
        {
            id: 1,
            title: "Workshop Seni Eco-Friendly",
            description: "Pelajari cara membuat karya seni menggunakan bahan daur ulang dalam workshop ini.",
            details: "Workshop ini akan diadakan secara offline di Taman Kota pada 25 Desember 2024.",
            date: "25 Desember 2024",
            organizer: "Komunitas Seni Hijau",
            cost: "Rp50.000",
            image: "/images/community.png",
        },
        {
            id: 2,
            title: "Lomba Fotografi Alam",
            description: "Tunjukkan keindahan alam melalui lensa kamera dan menangkan hadiah menarik.",
            details: "Lomba akan berlangsung online dengan pengumpulan foto melalui platform kami hingga 28 Desember 2024.",
            date: "28 Desember 2024",
            organizer: "Komunitas Fotografi Nusantara",
            cost: "Gratis",
            image: "/images/community.png",
        },
        {
            id: 3,
            title: "Seminar Lingkungan Hidup",
            description: "Ikuti seminar inspiratif tentang peran pemuda dalam menjaga kelestarian lingkungan.",
            details: "Seminar akan diselenggarakan secara virtual melalui Zoom Meeting pada 1 Januari 2025.",
            date: "1 Januari 2025",
            organizer: "Lembaga Lingkungan Global",
            cost: "Rp25.000",
            image: "/images/community.png",
        },
    ];

    return (
        <section className="min-h-screen bg-gradient-to-b from-yellow-50 to-green-100 py-16 px-4 md:px-8">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">Acara Mendatang</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Jangan lewatkan kesempatan untuk belajar, berjejaring, dan berbagi ide dalam berbagai acara menarik kami.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <div className="relative">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                                    <p className="text-gray-600">{event.description}</p>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full bg-green-50 text-gray-700 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                                <p className="text-sm">{event.details}</p>
                                <button
                                    className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    Detail
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/2">
                        <h2 className="text-2xl font-bold text-green-600 mb-4">{selectedEvent.title}</h2>
                        <p className="text-gray-700 mb-2">
                            <strong>Tanggal:</strong> {selectedEvent.date}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong>Panitia Penyelenggara:</strong> {selectedEvent.organizer}
                        </p>
                        <p className="text-gray-700 mb-4">
                            <strong>Biaya:</strong> {selectedEvent.cost}
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                onClick={() => setSelectedEvent(null)}
                            >
                                <X className="w-5 h-5" /> Batalkan
                            </button>
                            <button
                                className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                                onClick={() => console.log(`Attend to event ${selectedEvent.id}`)}
                            >
                                <ArrowRight className="w-5 h-5" /> Attend
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default EventPage;
