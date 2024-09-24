"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Flex, Tag, Image } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import GetRequestData from "../_FetchFunction/GetRequestData";
import { MdOutlineHandyman } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa";
import { GrStatusInfo } from "react-icons/gr";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const RequestDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { rid } = useParams();

  async function GetData() {
    try {
      setLoading(true);
      const info = await GetRequestData(rid);

      if (info.success) {
        setData(info.requestdetails);
      } else {
        toast.error(info.message);
      }
    } catch (error) {
      toast.error("please try again");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    GetData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mb-10">
      <p className="text-2xl font-bold">Request Details</p>
      {loading ? (
        <Box sx={{ display: "flex" }} className="mt-5">
          <CircularProgress />
        </Box>
      ) : (
        <div className="w-full">
          {data && (
            <div className="flex flex-col items-center lg:flex-row justify-around  m-auto w-full lg:w-full mt-5 xl:justify-around p-2">
              <Image
                src={`http://localhost:8000/api/v1/request/GetRequestPhotoController/${rid}`}
                className="object-cover rounded-md responsive-image"
                alt="image"
              />
              <div className="flex flex-col sm:w-3/4 xl:w-1/2 gap-y-4 formshadow p-3 sm:p-6 rounded-lg bg-gray-100 mt-5">
                <div className="flex items-center  sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <MdOutlineHandyman /> Service type :
                  </span>
                  <p className="text-lg">{data.service}</p>
                </div>
                <hr />
                <div className="flex items-center  sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <FaLocationDot /> Location :
                  </span>
                  <p className="text-lg flex ">{data.location}</p>
                </div>
                <hr />
                <div className="flex items-center  sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <FaCalendarCheck />
                    Visiting Date :
                  </span>
                  <p className="text-lg">
                    {data.date ? (
                      <>
                        {moment(data.date).format("MMMM Do YYYY")} at{" "}
                        {data.time}
                      </>
                    ) : (
                      "No date available"
                    )}
                  </p>
                </div>
                <hr />
                <div className="flex items-center  sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <GrStatusInfo />
                    Status :
                  </span>
                  <div className="text-lg">
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestDetails;
