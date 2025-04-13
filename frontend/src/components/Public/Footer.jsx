import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    { icon: <FaFacebookF />, href: "#", label: "Facebook" },
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaLinkedinIn />, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative container mx-auto px-6 py-12 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {/* About Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">About Us</h3>
            <p className="text-gray-300 leading-relaxed">
              R J College is committed to providing quality education and fostering academic excellence. Our state-of-the-art facilities and dedicated faculty ensure the best learning experience for our students.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Contact Us</h3>
            <ul className="space-y-4">
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 text-gray-300 group"
              >
                <FaMapMarkerAlt className="text-xl text-purple-400 mt-1 group-hover:text-purple-300 transition-colors" />
                <span className="leading-relaxed">4th Floor, Ramniranjan Jhunjhunwala College, Ghatkopar West, Mumbai 400086, Maharashtra, INDIA.</span>
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 text-gray-300 group"
              >
                <FaPhoneAlt className="text-xl text-purple-400 group-hover:text-purple-300 transition-colors" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 9876543210</a>
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 text-gray-300 group"
              >
                <FaEnvelope className="text-xl text-purple-400 group-hover:text-purple-300 transition-colors" />
                <a href="mailto:it@rjcollege.edu.in" className="hover:text-white transition-colors">it@rjcollege.edu.in</a>
              </motion.li>
            </ul>
          </div>

          {/* Map Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Find Us</h3>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <iframe
                title="College Location"
                className="w-full h-64 rounded-2xl"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.8664481764124!2d72.90824667471373!3d19.074684782134168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c62d45927ad1%3A0x9ee4301782e456bd!2sRamniranjan%20Jhunjhunwala%20College!5e0!3m2!1sen!2sin!4v1707405158177!5m2!1sen!2sin"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-700/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} R J College | All Rights Reserved
            </p>
            <div className="flex items-center gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600"></div>
    </footer>
  );
};

export default Footer;

// Add these styles to your global CSS or tailwind.config.js
/*
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
*/  
