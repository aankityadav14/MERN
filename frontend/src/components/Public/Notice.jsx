import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiDownload, FiCalendar, FiUser, FiFileText } from "react-icons/fi";

const NoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notices");
        setNotices(response.data);
      } catch (err) {
        setError("Error fetching notices. Please try again later.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
        Notice Board
      </h1>

      {error && (
        <div className="text-red-600 text-center bg-red-50 p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        </div>
      ) : notices.length > 0 ? (
        <div className="space-y-6">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {notice.title}
                  </h3>
                  <span className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="mr-1" />
                    {formatDate(notice.createdAt)}
                  </span>
                </div>

                <div className="mt-4 text-gray-600 space-y-3">
                  <p className="whitespace-pre-wrap">{notice.content}</p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <FiUser className="mr-1" />
                    <span>Issued by: {notice.issuedBy}</span>
                  </div>
                </div>

                {notice.fileUrl && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a
                      href={notice.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                    >
                      <FiFileText className="mr-2" />
                      <span>Download {notice.fileName || 'Attachment'}</span>
                      <FiDownload className="ml-2" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg">
          <FiFileText className="text-4xl text-gray-400 mb-2" />
          <p className="text-gray-500 text-lg">No notices available at this time</p>
        </div>
      )}
    </section>
  );
};

export default NoticePage;
