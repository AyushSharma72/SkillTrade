"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Flex, Tag, Image } from "antd";
import { useRouter } from "next/navigation";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import GetRequestData from "../_FetchFunction/GetRequestData";
import { MdOutlineHandyman } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa";
import { SiStatuspage } from "react-icons/si";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { TbMapPinCode } from "react-icons/tb";
import { FaAddressCard } from "react-icons/fa";
import { Button } from "../../../../components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import { DeleteRequestFetchFunction } from "../_FetchFunction/DeleteRequest";
import Modal from "@mui/material/Modal";

const RequestDetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { rid } = useParams();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  async function GetData() {
    try {
      setLoading(true);
      const info = await GetRequestData(rid);
      if (info.success) {
        setData(info.requestdetails);
        setImageUrl(
          `http://localhost:8000/api/v1/request/GetRequestPhotoController/${rid}`
        );
      } else {
        toast.error(info.message);
      }
    } catch (error) {
      toast.error("Please try again");
    } finally {
      setLoading(false);
    }
  }

  async function updateRequestImage(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (!image) {
        toast.error("please select an image");
        return;
      }
      formData.append("image", image);

      const response = await fetch(
        `http://localhost:8000/api/v1/request/UpdateRequestPhoto/${rid}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Photo updated successfully!");

        setImageUrl(`${imageUrl}?timestamp=${new Date().getTime()}`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update photo. Please try again.");
    }
  }

  async function DeleteRequest() {
    try {
      const response = await DeleteRequestFetchFunction(rid);
      if (response.success) {
        toast.success(response.message);
        router.push("/user/view_request");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error try again");
    }
  }
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    GetData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mb-10">
      <Toaster /> <p className="text-2xl font-bold">Request Details</p>
      {loading ? (
        <Box sx={{ display: "flex" }} className="mt-5">
          <CircularProgress />
        </Box>
      ) : (
        <div className="w-full">
          {data && (
            <div className="flex flex-col items-center lg:flex-row justify-around m-auto w-full lg:w-full mt-5 xl:justify-around p-2">
              <div className="flex flex-col gap-2 items-center">
                <Image
                  src={imageUrl}
                  className="object-cover rounded-md responsive-image !h-[300px]"
                  alt="Request Image"
                />
                <form
                  onSubmit={updateRequestImage}
                  className="flex justify-center items-center flex-col sm:flex-row"
                >
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Button type="submit">Update Photo</Button>
                </form>
                <p className="font-bold text-xl text-center">
                  {data.description}
                </p>
              </div>
              <div className="flex flex-col sm:w-[90%] xl:w-1/2 gap-y-4 formshadow p-3 sm:p-6 rounded-lg mt-5">
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <MdOutlineHandyman /> Service type :
                  </span>
                  <p className="text-lg">{data.service}</p>
                </div>
                <hr />
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <FaAddressCard /> Address :
                  </span>
                  <p className="text-lg">{data.location}</p>
                </div>
                <hr />
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <TbMapPinCode />
                    Pincode :
                  </span>
                  <p className="text-lg">{data.pincode}</p>
                </div>
                <hr />
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <FaLocationDot />
                    City :
                  </span>
                  <p className="text-lg">{data.city}</p>
                </div>
                <hr />
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg md:w-[30%]">
                    <FaCalendarCheck />
                    Visiting Date :
                  </span>
                  <p className="text-lg">
                    {data.date
                      ? `${moment(data.date).format("MMMM Do YYYY")} at ${
                          data.time
                        }`
                      : "No date available"}
                  </p>
                </div>
                <hr />
                <div className="flex items-center sm:justify-normal">
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
                <Button onClick={handleOpen}>Delete request</Button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style} className="flex flex-col gap-2">
                    <p className="font-bold text-center">
                      Are you sure you want to delete this request ?
                    </p>{" "}
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        DeleteRequest();
                      }}
                    >
                      Delete
                    </Button>
                    <Button onClick={handleClose}>Cancel</Button>
                  </Box>
                </Modal>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestDetails;
