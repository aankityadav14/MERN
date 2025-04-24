import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaArrowDown,
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import {
  FaBook,
  FaServer,
  FaWifi,
  FaMicrochip,
  FaTools,
  FaProjectDiagram,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaUsers,
  FaLaptopCode,
  FaRobot,
} from "react-icons/fa";
import {
  FaTrophy,
  FaCode,
  FaBriefcase,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import {
  BsArrowRightCircle,
  BsCalendarEvent,
  BsNewspaper,
  BsBookHalf,
} from "react-icons/bs";
import {
  MdScience,
  MdComputer,
  MdSchool,
  MdNotifications,
} from "react-icons/md";
import { HiAcademicCap } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";

// Update image imports to match exact filenames
import event from "../../assets/event.png";
import fieldVisit from "../../assets/filedvist.jpeg";
import teachers from "../../assets/teachers.jpeg";
import techExtreme from "../../assets/techxetrem.jpeg";
import { getAllAchievements, getAllEvents, getAllFaculty, getAllNotices } from "../../api/publicapi";

const bannerImages = [
  { src: event, alt: "Department Events" },
  { src: fieldVisit, alt: "Field Visits" },
  { src: teachers, alt: "Our Faculty" },
  { src: techExtreme, alt: "Tech Extreme" },
];

const Home = () => {
  const { isDarkMode } = useTheme();
  const [facultyList, setFacultyList] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [facultyRes, achievementsRes, eventsRes, noticesRes] =
          await Promise.all([
            getAllFaculty(),
            getAllAchievements(),
            getAllEvents(),
            getAllNotices(),
          ]);

        console.log("Faculty Response:", facultyRes);
        console.log("Achievements Response:", achievementsRes);
        console.log("Events Response:", eventsRes);

        setFacultyList(facultyRes || []);
        setAchievements(achievementsRes || []);
        setEvents(eventsRes || []);
        setNotices(noticesRes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
      setImageLoaded(false);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getGoogleDriveImage = (url) => {
    if (!url) return "";
    if (url.includes("drive.google.com")) {
      const fileId = url.match(/[-\w]{25,}/);
      return fileId ? `https://lh3.googleusercontent.com/d/${fileId[0]}` : "";
    }
    return url;
  };

  return (
    <div className={`w-full font-sans ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section with Parallax Effect */}
      <motion.section
        className="relative  h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <AnimatePresence mode="wait">
          {bannerImages.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{
                opacity: currentImageIndex === index ? 1 : 0,
                scale: currentImageIndex === index && imageLoaded ? 1 : 1.2,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded(true)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Modern Gradient Overlay */}
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-900/90 via-purple-900/80 to-blue-900/90' 
            : 'bg-gradient-to-br from-blue-600/90 via-purple-600/80 to-blue-600/90'
        }`}></div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center w-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="px-6 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
              Welcome to IT Department
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-extrabold mb-6 text-white leading-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Department of <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Information Technology
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Empowering Future Technologists through Innovation and Excellence
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => {
                document.getElementById('programs').scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Explore Programs <FaArrowRight />
            </button>
            <button 
              onClick={() => {
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Contact Us
            </button>
          </motion.div>

          {/* Modern Navigation Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index);
                  setImageLoaded(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentImageIndex === index
                    ? "bg-white scale-125 shadow-lg shadow-white/50"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Show image ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Modern Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{
            y: [0, 10, 0],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            })
          }
        >
          <div className="flex flex-col items-center">
            <span className="text-white text-sm mb-2 font-medium">
              Scroll to Explore
            </span>
            <FaArrowDown className="text-white text-2xl animate-bounce" />
          </div>
        </motion.div>
      </motion.section>

      {/* Quick Stats Section */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className={`text-center p-6 rounded-2xl shadow-lg ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-700 to-gray-800' 
                  : 'bg-gradient-to-br from-blue-50 to-purple-50'
              }`}
            >
              <FaGraduationCap className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Students</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className={`text-center p-6 rounded-2xl shadow-lg ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-700 to-gray-800' 
                  : 'bg-gradient-to-br from-purple-50 to-pink-50'
              }`}
            >
              <FaUsers className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">25+</h3>
              <p className="text-gray-600">Faculty Members</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className={`text-center p-6 rounded-2xl shadow-lg ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-700 to-gray-800' 
                  : 'bg-gradient-to-br from-green-50 to-blue-50'
              }`}
            >
              <FaLaptopCode className="text-4xl text-green-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">15+</h3>
              <p className="text-gray-600">Labs</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className={`text-center p-6 rounded-2xl shadow-lg ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-700 to-gray-800' 
                  : 'bg-gradient-to-br from-orange-50 to-red-50'
              }`}
            >
              <FaRobot className="text-4xl text-orange-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Research Projects</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Department Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              About Our <span className="text-blue-600">Department</span>
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-gray-700 leading-relaxed">
                The Department of Information Technology at Ramniranjan
                Jhunjhunwala College, Ghatkopar, Mumbai, was established in
                2007. We offer both undergraduate (B.Sc. IT) and postgraduate
                (M.Sc. IT) programs, with the M.Sc. IT program introduced in
                2016.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <HiAcademicCap className="text-2xl text-blue-600" />
                  <span className="text-gray-700">
                    State-of-the-art Infrastructure
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MdScience className="text-2xl text-blue-600" />
                  <span className="text-gray-700">
                    Research-Oriented Learning
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MdComputer className="text-2xl text-blue-600" />
                  <span className="text-gray-700">
                    Industry-Relevant Curriculum
                  </span>
                </div>
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2">
                Learn More <FaArrowRight />
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={teachers}
                  alt="Department Overview"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="text-blue-600">Programs</span>
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : ''
              }`}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <FaGraduationCap className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">B.Sc. IT</h3>
              <p className="text-gray-600 mb-6">
                Three-year undergraduate program focusing on core IT concepts
                and practical skills.
              </p>
              <button className="text-blue-600 font-semibold flex items-center gap-2">
                Learn More <FaArrowRight />
              </button>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : ''
              }`}
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <MdSchool className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">M.Sc. IT</h3>
              <p className="text-gray-600 mb-6">
                Two-year postgraduate program with advanced IT concepts and
                research focus.
              </p>
              <button className="text-purple-600 font-semibold flex items-center gap-2">
                Learn More <FaArrowRight />
              </button>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className={`bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : ''
              }`}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <BsBookHalf className="text-2xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Certification Courses</h3>
              <p className="text-gray-600 mb-6">
                Short-term specialized courses for skill enhancement and
                professional development.
              </p>
              <button className="text-green-600 font-semibold flex items-center gap-2">
                Learn More <FaArrowRight />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* News & Events Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Latest <span className="text-blue-600">Notices & Events</span>
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Notices Section */}
            <div>
              <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <MdNotifications className="text-blue-600" />
                Latest Notices
              </h3>
              <div className="space-y-6">
                {notices && notices.length > 0 ? (
                  notices.map((notice) => (
                    <motion.div
                      key={notice._id}
                      whileHover={{ y: -5 }}
                      className={`rounded-xl p-6 shadow-lg hover:shadow-xl transition-all ${
                        isDarkMode 
                          ? 'bg-gray-800 hover:bg-gray-700' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MdNotifications className="text-2xl text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold mb-2">
                            {notice.title}
                          </h4>
                          <p className="text-gray-600 mb-3">
                            {notice.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="text-blue-600" />
                              {new Date(notice.updatedAt).toLocaleDateString()}
                            </span>
                            {notice.category && (
                              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                                {notice.category}
                              </span>
                            )}
                          </div>
                          {notice.fileUrl && (
                            <a
                              href={getGoogleDriveImage(notice.fileUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700"
                            >
                              <span className="mr-2">View Document</span>
                              <FaArrowRight />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className={`text-center py-8 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No notices found
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Events Section */}
            <div>
              <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <FaCalendarAlt className="text-blue-600" />
                Upcoming Events
              </h3>
              <div className="space-y-6">
                {events && events.length > 0 ? (
                  events.map((event) => (
                    <motion.div
                      key={event._id}
                      whileHover={{ y: -5 }}
                      className={`rounded-xl p-6 shadow-lg hover:shadow-xl transition-all ${
                        isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {event.imageUrl && (
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={getGoogleDriveImage(event.imageUrl)}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="text-lg font-semibold mb-2">
                            {event.title}
                          </h4>
                          <p className="text-gray-600 mb-3">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="text-blue-600" />
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-blue-600" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className={`text-center py-8 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No upcoming events found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="text-blue-600">Faculty</span>
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {facultyList && facultyList.length > 0 ? (
              facultyList.map((member) => (
                <motion.div
                  key={member._id}
                  whileHover={{ y: -10 }}
                  className={`bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : ''
                  } group`}
                >
                  <div className="relative overflow-hidden rounded-xl mb-6">
                    <img
                      src={getGoogleDriveImage(member.imageUrl)}
                      alt={member.name}
                      className="w-full h-[350px] object-cover object-top  transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex space-x-2">
                          <a
                            href={`mailto:${member.email}`}
                            className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
                          >
                            <FaEnvelope className="text-lg" />
                          </a>
                          <a
                            href={`tel:${member.phone}`}
                            className="p-2 bg-green-600 rounded-full text-white hover:bg-green-700 transition-colors"
                          >
                            <FaPhone className="text-lg" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-2">
                    {member.designation}
                  </p>
                  <p className="text-gray-600 mb-4">{member.department}</p>
                  <div className="space-y-2">
                    <p className="text-gray-600 flex items-center gap-2">
                      <FaEnvelope className="text-blue-600" />
                      {member.email}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <FaPhone className="text-blue-600" />
                      {member.phone}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-12">
                No faculty members found
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Student Achievements Section */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Student <span className="text-blue-600">Achievements</span>
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>

          {achievements && achievements.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement._id}
                  whileHover={{ y: -10 }}
                  className={`bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : ''
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                      achievement.category === "Academic"
                        ? "bg-blue-100"
                        : achievement.category === "Competition"
                        ? "bg-purple-100"
                        : achievement.category === "Hackathon"
                        ? "bg-green-100"
                        : achievement.category === "Internship"
                        ? "bg-orange-100"
                        : achievement.category === "Placement"
                        ? "bg-yellow-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {achievement.category === "Academic" && (
                      <FaTrophy className="text-2xl text-blue-600" />
                    )}
                    {achievement.category === "Competition" && (
                      <FaCode className="text-2xl text-purple-600" />
                    )}
                    {achievement.category === "Hackathon" && (
                      <FaLaptopCode className="text-2xl text-green-600" />
                    )}
                    {achievement.category === "Internship" && (
                      <FaBriefcase className="text-2xl text-orange-600" />
                    )}
                    {achievement.category === "Placement" && (
                      <FaGraduationCap className="text-2xl text-yellow-600" />
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {achievement.achievementTitle}
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      {achievement.year}
                    </span>
                  </div>

                  <h4 className="text-lg text-gray-700 mb-3">
                    {achievement.studentName}
                  </h4>

                  <p className="text-gray-600 mb-4">
                    {achievement.description}
                  </p>

                  {achievement.imageUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={getGoogleDriveImage(achievement.imageUrl)}
                        alt={achievement.achievementTitle}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {achievement.proofUrl && (
                    <a
                      href={achievement.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Certificate
                      <FaArrowRight className="ml-2" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No achievements found
            </div>
          )}

          {/* Achievement Categories */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              "Academic",
              "Competition",
              "Hackathon",
              "Internship",
              "Placement",
            ].map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                className={`text-center p-4 bg-gray-50 rounded-xl ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : ''
                }`}
              >
                <span className="text-sm font-medium text-gray-800">
                  {category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact" className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Get in <span className="text-blue-600">Touch</span>
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Location</h3>
                  <p className="text-gray-600">
                    Ramniranjan Jhunjhunwala College
                    <br />
                    Ghatkopar, Mumbai - 400086
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaPhone className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Phone</h3>
                  <p className="text-gray-600">+91 1234567890</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">it@rjcollege.edu.in</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-2xl"
            >
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Your Message"
                  ></textarea>
                </div>
                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
