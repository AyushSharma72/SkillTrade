"use client";
import dynamic from "next/dynamic";

const Link = dynamic(() => import("next/link"), { ssr: false });
const FaFacebook = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaFacebook),
  { ssr: false }
);
const FaTwitter = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaTwitter),
  { ssr: false }
);
const FaInstagram = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaInstagram),
  { ssr: false }
);
const FaLinkedin = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaLinkedin),
  { ssr: false }
);

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:text-center ">
          {/* Logo & About */}
          <div>
            <h2 className="text-2xl font-bold">Skill Trade</h2>
            <p className="text-gray-400 mt-2">
              Empowering skills, connecting talent.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold md:text-center">
              Quick Links
            </h3>
            <div className="flex gap-3 md:justify-center">
              {" "}
              <Link href="/" className="text-gray-400 hover:text-white">
                Home
              </Link>
              |
              <Link href="/" className="text-gray-400 hover:text-white">
                About
              </Link>
              |
              <Link href="/Contact" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold ">Follow Us</h3>
            <div className="flex md:justify-center mt-2 gap-6">
              <a href="#" className="text-gray-400 hover:text-blue-500">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-700">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm mt-6 border-t border-gray-700 pt-4">
          © {new Date().getFullYear()} Skill Trade. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
