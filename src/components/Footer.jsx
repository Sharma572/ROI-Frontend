import React from "react";

const Footer = () => {
  return (
    <footer style={{background:"#1ac47d"}} className="text-white py-8 px-4">
      
      {/* Address + Contact */}
      <div className="text-center space-y-2">
        {/* <p className="text-sm">
          Regus, Plot No.22, TOWER-2, Assotech Business Cresterra,  
          Sector-135, Noida, UP 201301
        </p> */}
        <p className="text-sm font-medium">
          📞 1800-843-6467 •  ✉  info@chargecity.co
        </p>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-white my-6"></div>

      {/* Policy Links */}
      <div className="flex items-center justify-center gap-6 text-sm font-medium">
        <a
          href="/refund.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-400 transition-colors"
        >
          Refund Policy
        </a>

        <span className="text-gray-100">|</span>

        <a
          href="/privacy.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-400 transition-colors"
        >
          Privacy Policy
        </a>

        <span className="text-gray-100">|</span>

        <a
          href="/service.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-400 transition-colors"
        >
          Terms & Conditions
        </a>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-100 mt-6">
        © {new Date().getFullYear()} COULOMB EV SOLUTIONS PRIVATE LIMITED | All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
