import React, { useState, useEffect } from "react";
import axios from "axios";

const Timetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/timetable");
        setTimetable(response.data);
      } catch (err) {
        setError("Error fetching timetable.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  // Function to extract Google Drive File ID and generate direct view URL
  const getGoogleDriveFileId = (url) => {
    if (url.includes("drive.google.com")) {
      return url.match(/d\/([^/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1];
    }
    return null;
  };

  const formatMediaUrl = (url) => {
    const fileId = getGoogleDriveFileId(url);
    if (fileId) {
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
    return url;
  };

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
        Class Timetable
      </h1>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-center bg-red-100 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 animate-pulse">Loading Timetable...</p>
        </div>
      ) : timetable.length > 0 ? (
        // Timetable Cards
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timetable.map((entry, index) => {
            const fileId = getGoogleDriveFileId(entry.media);
            const formattedUrl = formatMediaUrl(entry.media);
            return (
              <div key={index} className="bg-white border border-gray-300 shadow-lg rounded-lg p-4">
                <h2 className="text-xl font-bold mb-2">Year: {entry.year}</h2>
                <h3 className="text-lg mb-2">Faculty: {entry.facultyName}</h3>
                <h3 className="text-md text-gray-500">File ID: {fileId || "N/A"}</h3>
                <div className="media-container">
                  {entry.media.endsWith(".pdf") || fileId ? (
                    <iframe
                      src={`https://drive.google.com/file/d/${fileId}/preview`}
                      width="100%"
                      height="400px"
                      title={`Timetable PDF ${index}`}
                      className="rounded-lg"
                      sandbox="allow-scripts allow-same-origin"
                    ></iframe>
                  ) : (
                    <img
                      src={formattedUrl}
                      alt={`Timetable Media ${index}`}
                      className="max-w-full h-auto rounded-lg"
                    />
                  )}
                </div>
                {/* Fallback: Open PDF in new tab */}
                {entry.media.endsWith(".pdf") && (
                  <div className="mt-3 text-center">
                    <a
                      href={`https://drive.google.com/file/d/${fileId}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      📄 Open PDF
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // No Data Available
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg">🚫 No Timetable Available</p>
        </div>
      )}
    </section>
  );
};

export default Timetable;
