"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import image from "../../../assests/Empty.svg";
import GetRequestData from "../_FetchFunction/GetRequestData";
import { MdOutlineHandyman } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa";
import { GrStatusInfo } from "react-icons/gr";

const RequestDetails = () => {
  const [data, setdata] = useState([]);
  const [loading,setloading] = useState(true);
  const { rid } = useParams();

  async function GetData() {
    try {
      setloading(true);
      const info = await GetRequestData(rid);

      if (info.success) {
        setdata(info.requests);
        setloading(false);
      } else {
        toast.error(info.message);
        setloading(false);
      }
    } catch (error) {
      toast.error("please try again");
      setloading(false);
    }
  }

  return (
    <div className="flex  flex-col items-center justify-center">
      <p className="text-xl font-bold">Request Details</p>

      <div className="flex  justify-around items-center w-3/4 mt-10">
        <Image src={image} className="h-[300px] w-[300px]" alt="image"></Image>
        <div className="flex flex-col w-[40%] gap-y-4">
          <div className="flex justify-between items-center ">
            <span className="flex items-center gap-2 font-bold text-lg">
              <MdOutlineHandyman className="" /> Service type :
            </span>
            <p className="text-lg">Service type</p>
          </div>
          <hr className=""></hr>
          <div className="flex justify-between items-center ">
            <span className="flex items-center gap-2 font-bold text-lg">
              <FaLocationDot /> Location :
            </span>
            <p className="text-lg">Location</p>
          </div>
          <hr className=""></hr>
          <div className="flex justify-between items-center ">
            <span className="flex items-center gap-2 font-bold text-lg">
              <FaCalendarCheck />
              Visiting Date :
            </span>
            <p className="text-lg">Date</p>
          </div>
          <hr className=""></hr>
          <div className="flex justify-between items-center ">
            <span className="flex items-center gap-2 font-bold text-lg">
              <GrStatusInfo />
              Status :
            </span>
            <p className="text-lg">Status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
