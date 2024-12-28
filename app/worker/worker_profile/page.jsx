"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import demouserimage from "../../assests/demouserimage.jpg";
import { useAuth } from "@/app/_context/UserAuthContent";
import toast from "react-hot-toast";
import Lottie from "react-lottie";
import animationData from "../../assests/loading.json";
import Rating from "@mui/material/Rating";
import { FaSquareWhatsapp } from "react-icons/fa6";
import { FaSquarePhone } from "react-icons/fa6";
import { FaCircleUser } from "react-icons/fa6";
import { FaAddressCard } from "react-icons/fa";
import { TbMapPinCode } from "react-icons/tb";
import { PiCityFill } from "react-icons/pi";
import { FaCodePullRequest } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosTime } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import moment from "moment";
import { Badge, Space } from "antd";
import ModalComponent from "./Modal";
import ImageEditModal from "./Modals/ImageEditModal";
import EditProfileModal from "./Modals/EditProfileModal";

const WorkerProfile = () => {
  const [auth, SetAuth] = useAuth();
  const [WorkerData, SetWorkerData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpen2 = () => setOpen2(true);
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);
  const [imageError, setImageError] = useState(false);

  <Space
    direction="vertical"
    size="middle"
    style={{
      width: "100%",
    }}
  ></Space>;
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  async function GetWorkerData() {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/workers/GetWorkerData/${auth?.user._id}`
      );
      if (response) {
        const data = await response.json();
        if (data.success) {
          SetWorkerData(data.worker);
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error("Error fetching data");
      }
    } catch (error) {
      toast.error("error try again");
    }
  }

  useEffect(() => {
    if (auth?.user?._id) {
      GetWorkerData();
    }
  }, [auth]);

  if (!auth?.user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Lottie
          options={defaultOptions}
          height={150}
          width={200}
          isClickToPauseDisabled={true}
        />
        <p className="font-bold tracking-wider">Loading auth.....</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center md:h-screen  bg-gray-200 ">
      <p className="font-semibold text-3xl sm:mt-2 mt-20"> WorkerProfile</p>

      <div className="flex justify-center md:gap-5 items-center md:items-start  mt-5 w-full md:flex-row flex-col  gap-5">
        {/* left div  */}
        <div className="xl:w-[20%] lg:w-[25%] sm:w-1/2 w-[90%] ">
          {" "}
          <Badge.Ribbon
            text={`${WorkerData.verfied ? "Verified" : "Unverified"}`}
            color={`${WorkerData.verfied ? "" : "red"}`}
            placement="start"
          >
            <FaEdit
              className="absolute right-3 top-2 cursor-pointer"
              title="edit profile"
              onClick={handleOpen}
            />
            <div className="flex flex-col justify-start gap-3">
              {/* image */}

              <div className="flex flex-col justify-center items-center p-3 gap-1 rounded-lg shadow-lg bg-white">
                <Image
                  src={
                    imageError
                      ? demouserimage // Fallback image if error occurs
                      : `http://localhost:8000/api/v1/workers/GetWorkerImage/${auth?.user?._id}`
                  }
                  alt="Worker"
                  width={200}
                  height={200}
                  className="rounded-[50%] shadow-md"
                  onError={() => setImageError(true)}
                />
                <p className="text-2xl font-semibold">{WorkerData?.Name}</p>
                <p>{WorkerData?.ServiceType}</p>
                <p className="flex items-center">
                  <Rating
                    name="half-rating-read"
                    defaultValue={WorkerData?.OverallRaitngs}
                    precision={0.5}
                    readOnly
                  />
                </p>
                <p>
                  {WorkerData?.OverallRaitngs === 0 ? (
                    <span className="text-sm text-gray-600">
                      No rating given
                    </span>
                  ) : (
                    <span className="text-sm text-gray-600">
                      {WorkerData?.Ratings?.length} Ratings
                    </span>
                  )}
                </p>
              </div>
              <div className="bg-white p-3  rounded-lg  flex flex-col gap-3 shadow-lg">
                <div
                  className="flex  items-center gap-2 cursor-pointer"
                  onClick={() => {
                    const url = `https://wa.me/+91${WorkerData?.MobileNo}`;
                    window.open(url, "_blank");
                  }}
                >
                  <FaSquareWhatsapp className="text-3xl  text-green-600" />
                  Message on whatsapp
                </div>
                <hr />
                <div
                  className="flex  items-center gap-2 cursor-pointer"
                  onClick={() => {
                    const url = `tel:${WorkerData?.MobileNo}`;
                    window.open(url, "_self");
                  }}
                >
                  <FaSquarePhone className="text-3xl text-blue-600" />
                  {WorkerData?.MobileNo}
                </div>
              </div>
            </div>
          </Badge.Ribbon>
        </div>
        <ModalComponent
          open={open}
          handleClose={handleClose}
          ModalType={ImageEditModal}
          GetWorkerData={GetWorkerData}
        />
        <ModalComponent
          open={open2}
          handleClose={handleClose2}
          ModalType={EditProfileModal}
          GetWorkerData={GetWorkerData}
        />
        {/* right div  */}
        <div className="bg-white xl:w-1/2 lg:w-[60%] w-[90%] p-5 rounded-lg flex flex-col gap-5 shadow-lg relative mb-2 h-[550px]">
          <FaEdit
            className="absolute right-3 top-2 cursor-pointer"
            title="edit profile"
            onClick={handleOpen2}
          />
          <hr className="mt-4" />
          <div className="flex ">
            <span className="md:w-[35%] w-1/2 flex gap-2 items-center font-bold">
              <FaCircleUser className="text-xl" />
              Role
            </span>
            <p>{WorkerData?.role === 1 ? "Worker" : "User"}</p>
          </div>

          {/* address */}
          <hr />
          <div className="flex ">
            <span className="md:w-[35%] w-1/2 flex gap-2 items-center font-bold">
              <FaAddressCard className="text-xl" />
              Address
            </span>
            <p>{WorkerData?.Address}</p>
          </div>

          {/* pincode  */}

          <hr />
          <div className="flex ">
            <span className="md:w-[35%] w-1/2 flex gap-2 items-center font-bold">
              <TbMapPinCode className="text-xl" />
              Pincode
            </span>
            <p>{WorkerData?.pincode}</p>
          </div>

          {/* city  */}

          <hr />
          <div className="flex ">
            <span className="md:w-[35%] w-1/2 flex gap-2 items-center font-bold">
              <PiCityFill className="text-xl" />
              City
            </span>
            <p>{WorkerData?.city}</p>
          </div>

          {/* Assigned Request */}
          <hr />
          <div className="flex ">
            <span className="md:w-[35%] w-1/2 flex gap-2 items-center font-bold">
              <FaCodePullRequest className="text-xl" />
              Assigned requests
            </span>
            <p>{WorkerData?.assignedRequest?.length}</p>
          </div>

          {/* Completed Request */}
          <hr />
          <div className="flex ">
            <span className="md:w-[35%] w-1/2 flex gap-2 items-center font-bold">
              <FaCheckCircle className="text-xl" />
              Completed requests
            </span>
            {/* <p>{WorkerData?.CompletedRequest?.length}</p> */}
            <p>{WorkerData?.assignedRequest?.length}</p>
          </div>

          {/* joined  */}
          <hr />
          <div className="flex ">
            <span className="md:w-[35%] w-1/2 flex gap-2 items-center font-bold">
              <IoIosTime className="text-xl" />
              Joined
            </span>

            <p>{moment(WorkerData.createdAt).format(" MMMM Do YYYY")}</p>
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
