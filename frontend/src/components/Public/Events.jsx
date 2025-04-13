import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAllEvents } from '../../api/publicapi';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        console.log(data);
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  const getGoogleDriveImage = (url) => {
    // Extract FILE_ID from Google Drive URL
    const match = url.match(/[-\w]{25,}/);

    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : `https://google.com/drive/folders/uc?export=view&id=${match[1]}`;
  };

  return (
    <section className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
        Upcoming Events
      </h2>

      {loading ? (
        // Skeleton Loader
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 animate-pulse">Loading Events...</p>
        </div>
      ) : events.length > 0 ? (
        // Event Grid
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition duration-300"
            >
              <img
                src={getGoogleDriveImage(event.imageUrl)}
                alt={event.eventName}
                className="w-full h-48 object-cover"
                // loading="lazy"
                referrerPolicy="no-referrer"
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {event.eventName}
                </h3>
                <p className="text-gray-600">
                  📅 {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">📍 {event.location}</p>
                <p className="text-gray-700 mt-2">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // No Data Found
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg">🚫 No Events Available</p>
        </div>
      )}
    </section>
  );
};

export default Events;
