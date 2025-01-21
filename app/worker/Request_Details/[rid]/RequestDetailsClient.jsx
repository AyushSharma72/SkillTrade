"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tag, Image } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { MdOutlineHandyman } from "react-icons/md";
import { FaLocationDot, FaCalendarCheck, FaAddressCard } from "react-icons/fa6";
import { SiStatuspage } from "react-icons/si";
import moment from "moment";
import { Button } from "../../../../components/ui/button";
import { TbMapPinCode, TbMessageReport } from "react-icons/tb";
import { PulseLoader } from "react-spinners";
import { toast, Toaster } from "react-hot-toast";
import ModalComponent from "../../../_components/Modal";
import ReportModal from "./../_Modals/ReportModal";
import AcceptRequest from "../_Modals/AcceptRequest";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import { Typography } from "@mui/material";
import Empty from "../../../assests/Empty.svg";
import { useAuth } from "@/app/_context/UserAuthContent";

const RequestDetailsClient = ({
  IntialRequestData,
  loadingstate,
  requestimage,
}) => {
  const [data, setData] = useState(IntialRequestData);
  const [loading, setLoading] = useState(loadingstate);
  const { rid } = useParams();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [WorkerCoordinates, SetWorkerCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [auth, Setauth] = useAuth();
  const handleClose = () => setOpen(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  useEffect(() => {
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
      <p className="text-3xl font-bold mt-5">Request Details</p>

      {data?.status === "Deleted" && (
        <Alert severity="error" className="w-full mt-4">
          This request was deleted.
        </Alert>
      )}

      {loading ? (
        <div className="h-[600px] w-full flex items-center justify-center">
          <span className="flex gap-2 text-xl items-center font-semibold text-gray-600">
            Loading Data <PulseLoader size={12} color="#4A90E2" />
          </span>
        </div>
      ) : (
        <div className="mt-2 ">
          {data ? (
            <div className="flex flex-col lg:flex-row gap-6 bg-white shadow-lg rounded-lg p-2">
              {/* Image Section */}
              <div className="flex flex-col items-center justify-between lg:w-2/5 ">
                <Image
                  src={requestimage}
                  className="object-cover rounded-md lg:!h-[400px] lg:!w-full !h-[300px] "
                />

                <p className="font-bold text-xl text-center mt-4">
                  {data.description}
                </p>
              </div>

              {/* Details Section */}
              <div className="flex flex-col gap-4 lg:w-3/5 bg-gray-50 p-4 rounded-md relative">
                {auth?.user?.role === 1? (
                  <div
                    className="absolute top-4 right-5 flex items-center gap-1 cursor-pointer text-gray-500"
                    onClick={() => setOpen(true)}
                  >
                    <TbMessageReport /> Report
                  </div>
                ):null}

                {/* Service Type */}
                <div className="flex items-center">
                  <span className="flex items-center gap-2 font-semibold text-lg w-1/3">
                    <MdOutlineHandyman /> Service type:
                  </span>
                  <p className="text-base">{data.service}</p>
                </div>
                <hr />

                {/* Address */}
                <div className="flex items-center">
                  <span className="flex items-center gap-2 font-semibold text-lg w-1/3">
                    <FaAddressCard /> Address:
                  </span>
                  <p className="text-base">
                    {WorkerCoordinates.latitude &&
                    data.coordinates?.coordinates[1] ? (
                      <a
                        href={`https://www.google.com/maps?q=${data.coordinates?.coordinates[1]},${data.coordinates?.coordinates[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium"
                      >
                        {data.location}
                      </a>
                    ) : (
                      data.location
                    )}
                  </p>
                </div>
                <hr />

                {/* Pincode */}
                <div className="flex items-center">
                  <span className="flex items-center gap-2 font-semibold text-lg w-1/3">
                    <TbMapPinCode /> Pincode:
                  </span>
                  <p className="text-base">{data.pincode}</p>
                </div>
                <hr />

                {/* City */}
                <div className="flex items-center">
                  <span className="flex items-center gap-2 font-semibold text-lg w-1/3">
                    <FaLocationDot /> City:
                  </span>
                  <p className="text-base">{data.city}</p>
                </div>
                <hr />

                {/* Visiting Date */}
                <div className="flex items-center">
                  <span className="flex items-center gap-2 font-semibold text-lg w-1/3">
                    <FaCalendarCheck /> Visiting Date:
                  </span>
                  <p className="text-base">
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

                {/* Status */}
                <div className="flex items-center">
                  <span className="flex items-center gap-2 font-semibold text-lg w-1/3">
                    <SiStatuspage /> Status:
                  </span>
                  <div>
                    {data.status === "Pending" ? (
                      <Tag icon={<ClockCircleOutlined />} color="warning">
                        Pending
                      </Tag>
                    ) : data.status === "Accepted" ? (
                      <Tag icon={<CheckCircleOutlined />} color="blue">
                        Accepted
                      </Tag>
                    ) :  data.status === "Assigned" ? (
                      <Tag icon={<CheckCircleOutlined />} color="green">
                        Assigned
                      </Tag>
                    ) :(
                      <Tag icon={<CheckCircleOutlined />} color="red">
                        {data.status}
                      </Tag>
                    )}
                  </div>
                </div>
                <hr />

                {/* Created By */}
                <div className="flex items-center">
                  <span className="flex items-center gap-2 font-semibold text-lg w-1/3">
                    <FaLocationDot /> Created by:
                  </span>
                  <p className="text-base">
                    {data.user.Name} on{" "}
                    {moment(data.createdAt).format("MMMM Do YYYY, h:mm A")}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                  {auth?.user?.role !== 1 ||
                  data.status === "Completed" ||
                  data.status === "Deleted" ? null : (
                    <Button onClick={handleOpen2} className="w-full sm:w-1/2">
                      Accept Request
                    </Button>
                  )}
                  <Link
                    href={
                      auth?.user?.role === 1
                        ? `/worker/all_request`
                        : `/admin/reports`
                    }
                    className="w-full sm:w-1/2"
                  >
                    <Button className="w-full">Back</Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Typography variant="h5" className="mb-4 text-center">
                Request not found
              </Typography>
              <Image
                src={Empty}
                alt="No Data"
                width={400}
                height={400}
                className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]"
              />
              <Link href="/">
                <Button className="mt-4">Go Home</Button>
              </Link>
            </div>
          )}

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

export default RequestDetailsClient;
