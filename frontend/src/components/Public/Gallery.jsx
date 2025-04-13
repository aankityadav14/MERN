import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaImage, FaVideo, FaFilePdf, FaTimes } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { getGalleryImages, getGalleryCategories, getImagesByCategory } from '../../api/publicapi';

const Gallery = () => {
  const { isDarkMode } = useTheme();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState('all');

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
        const data = await getGalleryImages(); // Backend API
        console.log(data);
        setGalleries(data);
      } catch (err) {
        setError("Error fetching gallery images.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredGalleries = galleries.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image':
        return <FaImage className="text-blue-500" />;
      case 'video':
        return <FaVideo className="text-red-500" />;
      case 'pdf':
        return <FaFilePdf className="text-purple-500" />;
      default:
        return <FaImage className="text-gray-500" />;
    }
  };

  return (
    <div className={`min-h-screen py-12 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Department Gallery
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Explore our collection of photos, videos, and documents showcasing department events, achievements, and activities.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: "all", label: "All", icon: FaImage },
            { id: "image", label: "Images", icon: FaImage },
            { id: "video", label: "Videos", icon: FaVideo },
            { id: "pdf", label: "Documents", icon: FaFilePdf },
          ].map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(type.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${
                filter === type.id
                  ? isDarkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <type.icon />
              <span>{type.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-red-500"
          >
            {error}
          </motion.div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            Loading gallery...
          </motion.div>
        ) : filteredGalleries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGalleries.map((gallery, index) => (
              <motion.div
                key={gallery._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-xl ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-lg hover:shadow-xl transition-all duration-300`}
                onClick={() => setSelectedMedia(gallery)}
              >
                <div className="relative aspect-video">
                  {gallery.type === "pdf" ? (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <FaFilePdf className="text-4xl text-purple-500" />
                    </div>
                  ) : gallery.type === "video" ? (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <FaVideo className="text-4xl text-red-500" />
                    </div>
                  ) : (
                    <img
                      src={getGoogleDriveDirectLink(gallery.mediaUrl)}
                      alt={gallery.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-lg font-semibold">{gallery.title}</h3>
                      <p className="text-sm opacity-80">{gallery.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {filter === 'all' ? 'No media available' : `No ${filter}s available`}
          </motion.div>
        )}

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm"
              onClick={() => setSelectedMedia(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                >
                  <FaTimes size={24} />
                </button>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {selectedMedia.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedMedia.description}
                  </p>
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    {selectedMedia.type === "pdf" ? (
                      <iframe
                        src={selectedMedia.mediaUrl}
                        className="w-full h-full"
                        title={selectedMedia.title}
                      />
                    ) : selectedMedia.type === "video" ? (
                      <iframe
                        src={getGoogleDriveVideoLink(selectedMedia.mediaUrl)}
                        className="w-full h-full"
                        title={selectedMedia.title}
                        allowFullScreen
                      />
                    ) : (
                      <img
                        src={getGoogleDriveDirectLink(selectedMedia.mediaUrl)}
                        alt={selectedMedia.title}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <a
                      href={selectedMedia.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition duration-300"
                    >
                      View Original
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;
