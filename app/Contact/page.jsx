"use client";
import React, { useState } from "react";
import Contactus from "../assests/contacus.jpg";
import {
  FaGithub,
  FaEnvelope,
  FaLinkedin,
} from "react-icons/fa";
import { toast,Toaster } from "react-hot-toast";
import Image from "next/image";
import Ayush from "../assests/Ayush2.jpg";
import Footer from "../_components/Footer";

const ContactForm = () => {
  const [Name, SetName] = useState("");
  const [Email, SetEmail] = useState("");
  const [Message, SetMessage] = useState("");
  const [loading, Setloading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      Setloading(true);
      const response = await fetch(
        "https://ayushreactbackend.onrender.com/api/v1/auth/SubmitUserQueryForm",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ Name, Email, Message }),
        }
      );
      if (response.status === 200) {
        toast.success("We received your query");
        SetName("");
        SetEmail("");
        SetMessage("");
      } else {
        toast.error("Please try after some time");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      Setloading(false);
    }
@@ -114,85 +114,85 @@
  return (
    <>
    <div className="flex flex-col items-center w-full px-4 mt-8">
        <Toaster/>
      <div className="flex flex-wrap justify-center gap-8 sm:w-3/4 p-3 bg-white shadow-lg mt-3">
        <ContactForm />
        <div className="flex flex-col p-3 rounded-lg">
          <Image
            src={Contactus}
            className="w-80 rounded-lg shadow-lg"
            alt="Contact Us"
          />
          <p className="text-xl font-semibold mt-4 mb-2 text-center">
            Contact us
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="mailto:asharma7588@gmail.com"
              className=" text-lg flex items-center mt-2"
            >
              <FaEnvelope className="text-xl mr-2" /> asharma7588@gmail.com
            </a>

            <a
              href="mailto:Mohitsinghtadhiyal8@gmail.com"
              className=" text-lg flex items-center mt-2"
            >
              <FaEnvelope className="text-xl mr-2" />{" "}
              Mohitsinghtadhiyal8@gmail.com
            </a>

            <div className=" text-lg flex items-center mt-2">
              <a
                href="https://www.linkedin.com/in/ayush-sharma-a155a8267"
                target="blank"
                className="flex"
              >
                <FaLinkedin className="text-2xl mr-2" /> Ayush Sharma
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* developed by  */}

      <p className="text-2xl font-bold text-gray-800 mt-10">Developed By</p>
      <div className="flex flex-col items-center mt-4">
        <Image
          src={Ayush}
          alt="Ayush Sharma"
          className="w-32 h-32 rounded-full object-cover shadow-lg mb-4"
        />
        <p className="text-lg font-semibold">Ayush Sharma</p>
        <p className="text-gray-600">Developer and Project Manager</p>
        <div className="flex mt-4 space-x-4">
          <a
            href="https://github.com/AyushSharma72"
            target="_blank"
            className="bg-gray-800 text-white p-3 rounded-full"
          >
            <FaGithub className="text-2xl" />
          </a>
          <a
            href="mailto:asharma7588@gmail.com"
            className="bg-red-500 text-white p-3 rounded-full"
          >
            <FaEnvelope className="text-2xl" />
          </a>
          <a
            href="https://www.linkedin.com/in/ayush-sharma-a155a8267"
            target="_blank"
            className="bg-blue-700 text-white p-3 rounded-full"
          >
            <FaLinkedin className="text-2xl" />
          </a>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Contact;
