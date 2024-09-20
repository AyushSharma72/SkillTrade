"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Flex, Tag } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import GetRequestData from "../_FetchFunction/GetRequestData";
import { MdOutlineHandyman } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa";
import { GrStatusInfo } from "react-icons/gr";
import moment from "moment";
import { Image } from "antd";

const RequestDetails = () => {
  const [data, setdata] = useState([]);
  const [loading, setloading] = useState(true);
  const { rid } = useParams();

  async function GetData() {
    try {
      setloading(true);
      const info = await GetRequestData(rid);

      if (info.success) {
        setdata(info.requestdetails);
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

  useEffect(() => {
    GetData();
  }, []);

  return (
    <div className="flex  flex-col items-center justify-center  mb-10">
      <p className="text-2xl font-bold ">Request Details</p>

      <div className="w-full">
        <div className="flex flex-col justify-center items-start m-auto w-full lg:w-3/4  mt-5 xl:justify-around  p-2">
          <Image
            src={`http://localhost:8000/api/v1/request/GetRequestPhotoController/${rid}`}
            className="object-cover rounded-md responsive-image"
            alt="image"
          />

          <div className="flex flex-col w-full  gap-y-4 formshadow p-3 sm:p-6 rounded-lg bg-gray-100 mt-5">
            <div className="flex  items-center justify-between  sm:justify-normal">
              <span className="flex items-center gap-2 font-bold text-lg  sm:w-1/4 ">
                <MdOutlineHandyman className="" /> Service type :
              </span>
              <p className="text-lg">{data.service}</p>
            </div>
            <hr className=""></hr>
            <div className="flex   items-center justify-between sm:justify-normal">
              <span className="flex items-center gap-2 font-bold text-lg  sm:w-1/4">
                <FaLocationDot /> Location :
              </span>
              <p className="text-lg flex flex-wrap w-[30%] sm:w-full">
                {data.location}
              </p>
            </div>
            <hr className=""></hr>
            <div className="flex   items-center justify-between  sm:justify-normal">
              <span className="flex items-center gap-2 font-bold text-lg  sm:w-1/4">
                <FaCalendarCheck />
                Visiting Date :
              </span>
              <p className="text-lg">
                {moment(data.date).format("MMMM Do YYYY")}
              </p>
            </div>
            <hr className=""></hr>
            <div className="flex   items-center justify-between  sm:justify-normal">
              <span className="flex items-center gap-2 font-bold text-lg   sm:w-1/4">
                <GrStatusInfo />
                Status :
              </span>
              <p className="text-lg">
                {data.status === "Pending" ? (
                  <Flex gap="4px 0" wrap>
                    <Tag icon={<ClockCircleOutlined />} color="warning">
                      {data.status}
                    </Tag>
                  </Flex>
                ) : (
                  <Flex gap="4px 0" wrap>
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      {data.status}
                    </Tag>
                  </Flex>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
