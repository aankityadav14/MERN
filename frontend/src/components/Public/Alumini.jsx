import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaLinkedin } from 'react-icons/fa'; // Import LinkedIn icon

function Alumini() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/alumni');
        setAlumni(response.data);
      } catch (err) {
        setError('Error fetching alumni data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const getGoogleDriveImageUrl = (url) => {
    const match = url.match(/\/d\/(.*?)\//);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">Alumni</h1>

      {error && (
        <div className="text-red-600 text-center bg-red-100 p-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 animate-pulse">Loading Alumni...</p>
        </div>
      ) : alumni.length > 0 ? (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {alumni.map((alum) => (
            <div key={alum._id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src={getGoogleDriveImageUrl(alum.imageUrl)}
                alt={alum.name}
                referrerPolicy="no-referrer"
                className="w-full h-48 object-cover object-center"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{alum.name}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Graduation Year:</span> {alum.graduationYear}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Department:</span> {alum.department}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {alum.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> {alum.phone}
                  </p>
                  {alum.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${alum.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaLinkedin className="text-xl" />
                      <span>View Profile</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-lg">No Alumni Available</p>
        </div>
      )}
    </section>
  );
}

export default Alumini;