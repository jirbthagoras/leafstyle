"use client";

import { MessageCircle, Calendar, Users, ArrowRight } from "lucide-react";

const CommunitySection = () => {
    const upcomingEvents = [
        {
            id: 1,
            title: "Pameran Seni Daur Ulang",
            date: "25 Des 2024",
            time: "13:00 - 17:00",
            location: "Taman Kota",
            type: "Offline",
        },
        {
            id: 2,
            title: "Workshop Fotografi Produk",
            date: "28 Des 2024",
            time: "15:00 - 16:30",
            location: "Zoom Meeting",
            type: "Online",
        },
        {
            id: 3,
            title: "Bazaar Barang Vintage",
            date: "1 Jan 2025",
            time: "10:00 - 16:00",
            location: "Mall Central",
            type: "Offline",
        },
    ];

    return (
        <section className="min-h-screen bg-gradient-to-b from-yellow-50 to-green-100 py-16 px-4 md:px-8">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
                        Bergabung dengan Komunitas Kami
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Temukan teman baru, berbagi pengalaman, dan ikuti event-event menarik bersama komunitas kami.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Chat Community Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transform transition-all hover:scale-105">
                        <div className="flex items-center mb-6">
                            <MessageCircle className="w-8 h-8 text-green-500 mr-3" />
                            <h3 className="text-2xl font-semibold text-gray-800">Chat Komunitas</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Bergabunglah dalam obrolan seru bersama para kolektor, seniman, dan pecinta barang vintage.
                            Diskusikan tentang hobi, berbagi tips, atau temukan barang impianmu!
                        </p>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <Users className="w-5 h-5 text-green-500 mr-2" />
                                <span className="text-sm text-gray-500">1.2k+ Members Online</span>
                            </div>
                            <button className="flex items-center text-green-500 hover:text-green-600 font-medium">
                                Gabung Chat <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>

                    {/* Events Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <div className="flex items-center mb-6">
                            <Calendar className="w-8 h-8 text-green-500 mr-3" />
                            <h3 className="text-2xl font-semibold text-gray-800">Event Mendatang</h3>
                        </div>
                        <div className="space-y-4">
                            {upcomingEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="border-l-4 border-green-500 pl-4 py-2 hover:bg-green-50 transition-colors"
                                >
                                    <h4 className="font-semibold text-gray-800">{event.title}</h4>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="text-sm text-gray-500">
                                            {event.date} • {event.time}
                                        </div>
                                        <span className={`text-xs px-4 py-1 rounded-full mx-2 ${
                                            event.type === "Online"
                                                ? "bg-blue-100 text-blue-600"
                                                : "bg-green-100 text-green-600"
                                        }`}>
                      {event.type}
                    </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        📍 {event.location}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">
                            Lihat Semua Event
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunitySection;