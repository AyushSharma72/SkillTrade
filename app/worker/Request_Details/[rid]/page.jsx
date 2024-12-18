"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Flex, Tag, Image } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { MdOutlineHandyman } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa";
import { SiStatuspage } from "react-icons/si";
import moment from "moment";
import { Button } from "../../../../components/ui/button";
import GetRequestData from "../_FetchFunction/GetRequestData";
import { TbMapPinCode } from "react-icons/tb";
import { FaAddressCard } from "react-icons/fa";
import { PulseLoader } from "react-spinners";
import { toast, Toaster } from "react-hot-toast";
import { GoReport } from "react-icons/go";
import ModalComponent from "../Modal";
import ReportModal from "./../_Modals/ReportModal";
import AcceptRequest from "../_Modals/AcceptRequest";

const RequestDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { rid } = useParams();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

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
    <div className="flex flex-col items-center justify-center mb-10 sm:mt-0 mt-20">
      <Toaster />
      <p className="text-2xl font-bold mt-2">Request Details</p>
      {loading ? (
        <div className="h-[600px] w-full flex">
          <span className="m-auto flex  gap-2 text-2xl items-center font-bold">
            Loading Data <PulseLoader size={20} />
          </span>
        </div>
      ) : (
        <div className="w-full">
          {data && (
            <div className="flex flex-col items-center lg:flex-row justify-around  m-auto w-full lg:w-full mt-5 xl:justify-around p-2">
              <div className="flex flex-col gap-2 justify-center items-center">
                <Image
                  src={`http://localhost:8000/api/v1/request/GetRequestPhotoController/${rid}`}
                  className="object-cover rounded-md responsive-image"
                  alt="image not provided"
                />
                <p className="font-bold text-xl text-center">
                  {data.description}
                </p>
              </div>
              <div className="flex flex-col sm:w-[90%] xl:w-1/2 gap-y-4 formshadow p-3 sm:p-6 rounded-lg  mt-5 relative">
                <div className="flex items-center  sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <MdOutlineHandyman /> Service type :
                  </span>
                  <p className="text-lg ">{data.service}</p>
                </div>
                <span
                  className="absolute right-[1%] top-[1%] flex items-center gap-2 text-gray-500 cursor-pointer"
                  onClick={handleOpen}
                >
                  <GoReport />
                  Report
                </span>

                <hr />
                <div className="flex items-center  sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <FaAddressCard /> Address :
                  </span>
                  <p className="text-lg flex ">{data.location}</p>
                </div>
                <hr />
                <div className="flex items-center  sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <TbMapPinCode />
                    Pincode :
                  </span>
                  <p className="text-lg flex ">{data.pincode}</p>
                </div>
                <hr />
                <div className="flex items-center  sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <FaLocationDot />
                    City :
                  </span>
                  <p className="text-lg flex ">{data.city}</p>
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
                    <SiStatuspage />
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
                <Button onClick={handleOpen2}>Accept Request</Button>
                {/* report modal */}
                <ModalComponent
                  open={open}
                  handleClose={handleClose}
                  ModalType={ReportModal}
                  rid={rid}
                />
                {/* Accept request modal */}
                <ModalComponent
                  open={open2}
                  handleClose={handleClose2}
                  ModalType={AcceptRequest}
                  rid={rid}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestDetails;
