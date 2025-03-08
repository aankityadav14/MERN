import React, { useEffect, useState } from "react";
import axios from "axios";

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Convert Google Drive link to a direct viewable link
  const getGoogleDriveDirectLink = (url) => {
    const match = url.match(/file\/d\/(.*?)\//);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  const getGoogleDriveVideoLink = (url) => {
    const match = url.match(/file\/d\/(.*?)\//);
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/gallery"); // Backend API
        console.log(response.data);
        setGalleries(response.data);
      } catch (err) {
        setError("Error fetching gallery images.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">📸 Gallery</h1>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-center bg-red-100 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 animate-pulse">Loading Gallery...</p>
        </div>
      ) : galleries.length > 0 ? (
        // Gallery Grid
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {galleries.map((gallery) => (
            <div key={gallery._id} className="bg-white shadow-lg rounded-lg p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{gallery.title}</h3>
              <div className="media-container">
                {gallery.type === "pdf" ? (
                  <iframe
                    src={gallery.mediaUrl}
                    width="100%"
                    height="400px"
                    title={`Gallery PDF ${gallery._id}`}
                    className="rounded-lg"
                  ></iframe>
                ) : gallery.type === "video" ? (
                  <iframe
                    src={getGoogleDriveVideoLink(gallery.mediaUrl)}
                    width="100%"
                    height="300px"
                    title={`Gallery Video ${gallery._id}`}
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                ) : (
                  <img
                    src={getGoogleDriveDirectLink(gallery.mediaUrl)}
                    alt={gallery.title}
                    className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // No Data Available
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg">🚫 No Images Available</p>
        </div>
      )}
    </section>
  );
};

export default Gallery;
