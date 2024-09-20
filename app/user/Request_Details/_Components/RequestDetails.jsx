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
    <div className="flex  flex-col items-center justify-center ">
      <p className="text-xl font-bold">Request Details</p>

      <div className="flex  justify-around items-center w-full mt-10 ">
        <Image
          src={`http://localhost:8000/api/v1/request/GetRequestPhotoController/${rid}`}
          className="h-[300px] w-[400px] object-cover rounded-md"
          width={400}
          height={300}
          alt="image"
        ></Image>
        <div className="flex flex-col w-1/2 gap-y-4 formshadow p-6 rounded-lg bg-gray-100">
          <div className="flex  items-center ">
            <span className="flex items-center gap-2 font-bold text-lg w-1/4">
              <MdOutlineHandyman className="" /> Service type :
            </span>
            <p className="text-lg">{data.service}</p>
          </div>
          <hr className=""></hr>
          <div className="flex   items-center ">
            <span className="flex items-center gap-2 font-bold text-lg   w-1/4">
              <FaLocationDot /> Location :
            </span>
            <p className="text-lg">{data.location}</p>
          </div>
          <hr className=""></hr>
          <div className="flex   items-center ">
            <span className="flex items-center gap-2 font-bold text-lg  w-1/4 ">
              <FaCalendarCheck />
              Visiting Date :
            </span>
            <p className="text-lg">
              {moment(data.date).format("MMMM Do YYYY")}
            </p>
          </div>
          <hr className=""></hr>
          <div className="flex   items-center ">
            <span className="flex items-center gap-2 font-bold text-lg   w-1/4">
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
  );
};

export default RequestDetails;
