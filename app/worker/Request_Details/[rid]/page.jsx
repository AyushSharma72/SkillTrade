"use client";
import React, { useEffect, useState, useRef } from "react";
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
import ModalComponent from "../../../_components/Modal";
import ReportModal from "./../_Modals/ReportModal";
import AcceptRequest from "../_Modals/AcceptRequest";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import { calculateDistance } from "../../../_Arrays/Arrays";

const RequestDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { rid } = useParams();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [WorkerCoordinates, SetWorkerCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const handleClose = () => setOpen(false);
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
      toast.error("Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    GetData();

    const userCoordinates = JSON.parse(localStorage.getItem("userCoordinates"));
    if (userCoordinates) {
      SetWorkerCoordinates({
        latitude: userCoordinates.latitude,
        longitude: userCoordinates.longitude,
      });
    } else {
      console.log("No user coordinates found in localStorage.");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mb-10 sm:mt-0 mt-20">
      <Toaster />
      <p className="text-2xl font-bold mt-2">Request Details</p>
      {data?.status === "Deleted" && (
        <Alert severity="error" className="w-full">
          This request was deleted.
        </Alert>
      )}
      {loading ? (
        <div className="h-[600px] w-full flex">
          <span className="m-auto flex gap-2 text-2xl items-center font-bold">
            Loading Data <PulseLoader size={20} />
          </span>
        </div>
      ) : (
        <div className="w-full mt-5">
          {data && (
            <div className="flex flex-col items-center xl:flex-row justify-around m-auto w-full lg:w-full xl:justify-around p-2">
              <div className="flex flex-col gap-2 justify-center items-center xl:w-[40%]">
                <Image
                  src={`http://localhost:8000/api/v1/request/GetRequestPhotoController/${rid}`}
                  className="object-cover rounded-md !h-[300px]"
                  alt="image not provided"
                />

                <p className="font-bold text-xl text-center">
                  {data.description}
                </p>
              </div>

              <div className="flex flex-col w-[90%] mt-5 xl:mt-0 xl:w-1/2 gap-y-4 formshadow p-3 sm:p-6 rounded-lg relative">
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <MdOutlineHandyman /> Service type:
                  </span>
                  <p className="text-lg">{data.service}</p>
                </div>
                <hr />
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <FaAddressCard /> Address:
                  </span>
                  <p className="text-lg flex text-center">
                    {data.location}{" "}
                    {WorkerCoordinates.latitude &&
                    data.coordinates?.coordinates[1] ? (
                      <a
                        href={`https://www.google.com/maps?q=${data.coordinates?.coordinates[1]},${data.coordinates?.coordinates[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-blue-500 underline"
                      >
                        {`${calculateDistance(
                          WorkerCoordinates.latitude,
                          WorkerCoordinates.longitude,
                          data.coordinates?.coordinates[1],
                          data.coordinates?.coordinates[0]
                        )} km `}
                      </a>
                    ) : (
                      <span className="text-red-500 ml-2">not available</span>
                    )}
                  </p>
                </div>
                <hr />
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <TbMapPinCode />
                    Pincode:
                  </span>
                  <p className="text-lg flex text-center">{data.pincode}</p>
                </div>
                <hr />
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <FaLocationDot />
                    City:
                  </span>
                  <p className="text-lg flex text-center">{data.city}</p>
                </div>
                <hr />
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <FaCalendarCheck />
                    Visiting Date:
                  </span>
                  <p className="text-lg text-center">
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
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <SiStatuspage />
                    Status:
                  </span>
                  <div className="text-lg text-center">
                    {data.status === "Pending" ? (
                      <Tag icon={<ClockCircleOutlined />} color="warning">
                        {data.status}
                      </Tag>
                    ) : data.status === "Accepted" ? (
                      <Tag icon={<CheckCircleOutlined />} color="blue">
                        {data.status}
                      </Tag>
                    ) : data.status === "Assigned" ? (
                      <Tag icon={<CheckCircleOutlined />} color="success">
                        {data.status}
                      </Tag>
                    ) : data.status === "Completed" ? (
                      <Tag icon={<CheckCircleOutlined />} color="purple">
                        {data.status}
                      </Tag>
                    ) : data.status === "Deleted" ? (
                      <Tag icon={<CheckCircleOutlined />} color="red">
                        {data.status}
                      </Tag>
                    ) : null}
                  </div>
                </div>
                <hr />
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <FaLocationDot />
                    Created by:
                  </span>
                  <p className="text-lg flex text-center">
                    {data.user.Name} on{" "}
                    {moment(data.createdAt).format("MMMM Do YYYY, h:mm A")}
                  </p>
                </div>
                <div className="flex gap-2 justify-center items-center">
                  {data.status === "Completed" ||
                  data.status === "Deleted" ? null : (
                    <Button onClick={handleOpen2} className="w-1/2">
                      Accept Request
                    </Button>
                  )}
                  <Link href="/worker/all_request" className="w-1/2">
                    <Button className="w-full">Back</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
          {/* Map Section */}
          {/* <div id="map" className="w-full h-[500px]  mt-5 rounded-lg"></div> */}

          {/* Report Modal */}
          <ModalComponent
            open={open}
            handleClose={handleClose}
            ModalType={ReportModal}
            id={rid}
          />
          {/* Accept Request Modal */}
          <ModalComponent
            open={open2}
            handleClose={handleClose2}
            ModalType={AcceptRequest}
            id={rid}
          />
        </div>
      )}
    </div>
  );
};

export default RequestDetails;
