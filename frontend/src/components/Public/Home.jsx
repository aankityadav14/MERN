import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/faculty") // Replace with actual API URL
      .then((response) => {
        console.log(response.data);
        if (Array.isArray(response.data)) {
          setFacultyList(response.data);
        } else {
          setFacultyList([]);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const getGoogleDriveImage = (url) => {
    if (!url) return "";
    const match = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  return (
    <div className="w-full font-sans text-gray-900">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold animate-fadeIn">
            Welcome to IT Department
          </h1>
          <p className="mt-3 text-xl opacity-90">
            Empowering Future Technologists
          </p>
        </div>
      </section>

      {/* About Department */}
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center text-blue-600">
          Information Technology
        </h2>
        <div className="mt-8 bg-white shadow-lg rounded-lg p-8 text-center hover:shadow-xl transition-shadow">
          <h3 className="text-3xl font-semibold text-gray-800">
            About Department
          </h3>
          <p className="mt-4 text-gray-700 leading-relaxed">
            The Department of Information Technology at Ramniranjan Jhunjhunwala
            College, Ghatkopar, Mumbai, was established in 2007. It offers both
            undergraduate (B.Sc. IT) and postgraduate (M.Sc. IT) programs. The
            M.Sc. IT program was introduced in 2016.
          </p>
        </div>

        {/* Courses Offered Section */}
        <section className="py-16 px-6 md:px-20 bg-gray-50">
          <h3 className="text-4xl font-bold text-center text-blue-600">
            Courses Offered
          </h3>
          <div className="mt-8 bg-white shadow-lg rounded-lg p-8 text-center hover:shadow-xl transition-shadow">
            <ul className="list-disc list-inside text-gray-700 leading-relaxed">
              <li>B.Sc. in Information Technology</li>
              <li>M.Sc. in Information Technology</li>
              <li>Short-term Certification Courses</li>
              <li>Workshops and Seminars</li>
            </ul>
          </div>
        </section>

        {/* Student Achievements Section */}
        <section className="py-16 px-6 md:px-20 bg-gray-50">
          <h3 className="text-4xl font-bold text-center text-blue-600">
            Student Achievements
          </h3>
          <div className="mt-8 bg-white shadow-lg rounded-lg p-8 text-center hover:shadow-xl transition-shadow">
            <p className="text-gray-700 leading-relaxed">
              Our students have excelled in various fields, winning numerous
              awards in coding competitions, hackathons, and academic
              conferences. They have also secured internships and job offers
              from top companies in the IT industry.
            </p>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="py-16 px-6 md:px-20 bg-gray-50">
          <h3 className="text-4xl font-bold text-center text-blue-600">
            Contact Us
          </h3>
          <div className="mt-8 bg-white shadow-lg rounded-lg p-8 text-center hover:shadow-xl transition-shadow">
            <p className="text-gray-700 leading-relaxed">
              For more information, please contact us at:
            </p>
            <p className="mt-4 text-gray-700">
              Email: itdepartment@rjcollege.edu.in
            </p>
            <p className="text-gray-700">Phone: +91 22 1234 5678</p>
            <p className="text-gray-700">
              Address: Ramniranjan Jhunjhunwala College, Ghatkopar, Mumbai
            </p>
          </div>
        </section>

        {/* Faculty Section */}
        <section className="py-16 px-6 md:px-20 bg-gray-50">
          <h3 className="text-4xl font-bold text-center text-blue-600">
            Faculty Members
          </h3>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {facultyList.length > 0 ? (
              facultyList.map((member, index) => (
                <div
                  key={index}
                  className="relative bg-white shadow-lg rounded-2xl p-6 text-center transition-transform transform hover:scale-105 group"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={getGoogleDriveImage(member.imageUrl)}
                      alt={member.name}
                      className="w-full h-56 object-cover rounded-xl"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Social Media Icons (Visible on Hover) */}
                    <div className="absolute top-4 left-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href="#"
                        className="block bg-orange-500 p-2 rounded-full text-white shadow-md"
                      >
                        🔗
                      </a>
                      <a
                        href="#"
                        className="block bg-green-500 p-2 rounded-full text-white shadow-md"
                      >
                        📱
                      </a>
                      <a
                        href="#"
                        className="block bg-blue-600 p-2 rounded-full text-white shadow-md"
                      >
                        🔗
                      </a>
                      <a
                        href="#"
                        className="block bg-red-600 p-2 rounded-full text-white shadow-md"
                      >
                        ▶️
                      </a>
                    </div>
                  </div>

                  {/* Faculty Details */}
                  <h4 className="mt-4 text-2xl font-semibold text-gray-900">
                    {member.name}
                  </h4>
                  <p className="text-blue-600 uppercase font-medium">
                    {member.designation}
                  </p>
                  <p className="text-gray-500">{member.email}</p>

                  {/* Share Button */}
                  <div className="absolute bottom-4 right-4">
                    <button className="bg-blue-500 p-3 rounded-full text-white shadow-md">
                      🔗
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No Faculty Found</p>
            )}
          </div>
        </section>
      </section>
    </div>
  );
};

export default Home;
