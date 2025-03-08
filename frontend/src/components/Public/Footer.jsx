import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-xl text-blue-400" />
                <span>4th Floor, Ramniranjan Jhunjhunwala College, Ghatkopar West, Mumbai 400086, Maharashtra, INDIA.</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-xl text-blue-400" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-xl text-blue-400" />
                <span>it@rjcollege.edu.in</span>
              </li>
            </ul>
          </div>

          {/* Map Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Find Us</h3>
            <iframe
              title="College Location"
              className="w-full h-48 md:h-56 rounded-lg shadow-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.8664481764124!2d72.90824667471373!3d19.074684782134168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c62d45927ad1%3A0x9ee4301782e456bd!2sRamniranjan%20Jhunjhunwala%20College!5e0!3m2!1sen!2sin!4v1707405158177!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-8 border-t border-gray-700 pt-4">
          <p className="text-gray-400">© 2025 R J College | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;  
