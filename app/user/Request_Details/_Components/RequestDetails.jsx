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
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { Textarea } from "@mui/joy";
import { UnAssign } from "../_FetchFunction/UnassignWorker";
import Rating from "@mui/material/Rating";
import { Input } from "@mui/joy";
import StarIcon from "@mui/icons-material/Star";
import { CompleteRequest } from "../_FetchFunction/CompleteRequest";
import { useAuth } from "@/app/_context/UserAuthContent";

const RequestDetails = () => {
  const [data, setData] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const { rid } = useParams();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [unassignModal, SetunassignModal] = useState(false);
  const [completed, SetCompleted] = useState(false);
  const router = useRouter();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [auth, setAuth] = useAuth();
  const [price, SetPrice] = useState(null);
  const [comment, SetComment] = useState("");

  const [stars, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);

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
  const labels = {
    1: "Very Poor 😭",

    2: "Poor 🥲",

    3: "Ok 🥱",

    4: "Good👍",

    5: "Excellent 😍",
  };
  function getLabelText(stars) {
    return `${stars} Star${stars !== 1 ? "s" : ""}, ${labels[stars]}`;
  }
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
  async function HandleCompleteRequest(wid) {
    try {
      const uid = auth?.user?._id;
      if (stars === 0) {
        toast.error("please give stars");
      }
      if (!price || !comment) {
        toast.error("price and comment are required");
      }
      if (!uid) {
        toast.error("user is missing try agian later");
      }

      const response = await CompleteRequest(
        rid,
        uid,
        wid,
        comment,
        price,
        stars
      );
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("error try again");
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
  async function UnassignWorker(e, wid) {
    e.preventDefault();
    if (!description || description.length < 30) {
      toast.error("please give description of atleast 30 characters");
      return;
    }
    try {
      const response = await UnAssign(rid, wid, description);
      const data = await response.json();
      if (response.status === 200) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("error making this request");
    } finally {
      SetunassignModal(false);
      setDescription("");
      GetData();
    }
  }
  const handleChange = (event) => {
    if (event.target.value.length <= 100) {
      setDescription(event.target.value);
    }
  };
  const handleCommentChange = (event) => {
    if (event.target.value.length <= 200) {
      SetComment(event.target.value);
    }
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
              <div className="flex flex-col w-full xl:w-1/2 gap-y-4 formshadow p-3 sm:p-6 rounded-lg ">
                <div className="flex items-center sm:justify-normal ">
                  <span className="flex items-center gap-2 font-bold text-lg sm:w-[30%]">
                    <MdOutlineHandyman /> Service type :
                  </span>
                  <p className="text-lg">{data.service}</p>
                </div>
                <hr />
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg sm:w-[30%]">
                    <FaAddressCard /> Address :
                  </span>
                  <p className="text-lg">{data.location}</p>
                </div>
                <hr />
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg sm:w-[30%]">
                    <TbMapPinCode />
                    Pincode :
                  </span>
                  <p className="text-lg">{data.pincode}</p>
                </div>
                <hr />
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg sm:w-[30%]">
                    <FaLocationDot />
                    City :
                  </span>
                  <p className="text-lg">{data.city}</p>
                </div>
                <hr />
                <div className="flex items-center sm:justify-normal">
                  <span className="flex items-center gap-2 font-bold text-lg sm:w-[30%]">
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
                  <span className="flex items-center gap-2 font-bold text-lg sm:w-[30%]">
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
                <hr />
                {data.assignedTo ? (
                  <div className="flex items-center sm:justify-normal">
                    <span className="flex items-center gap-2 font-bold text-lg sm:w-[30%]">
                      <MdOutlineAssignmentTurnedIn />
                      Assigned to :
                    </span>
                    <div className="text-lg flex justify-between items-center gap-5">
                      <span> {data.assignedTo?.Name}</span>
                      {data.status != "Completed" ? (
                        <Button
                          onClick={() => {
                            SetunassignModal(true);
                          }}
                        >
                          unassign
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {data.status != "Completed" ? (
                  <div className="flex gap-1 justify-around">
                    <Button
                      className="w-1/2"
                      onClick={() => {
                        SetCompleted(true);
                      }}
                    >
                      Mark as completed
                    </Button>
                    <Button onClick={handleOpen} className="w-1/2">
                      Delete request
                    </Button>
                  </div>
                ) : null}

                {/* modal */}
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

                {/* unassign modal */}
                <Modal
                  open={unassignModal}
                  onClose={() => {
                    SetunassignModal(false);
                  }}
                >
                  <Box sx={style} className="flex flex-col gap-2">
                    <p className="font-bold text-center">
                      Are you sure you want to unassign this worker ?
                    </p>{" "}
                    <div>
                      {" "}
                      <Textarea
                        name="description"
                        placeholder="Type reason"
                        value={description}
                        onChange={handleChange}
                        className="w-full h-20 overflow-y-scroll scrollbar-hide"
                        required
                      />
                      <p className="text-gray-400">
                        {100 - description.length} characters remaining
                      </p>
                    </div>
                    <Button
                      onClick={(e) => {
                        UnassignWorker(e, data.assignedTo?._id);
                      }}
                    >
                      Unassign
                    </Button>
                    <Button
                      onClick={() => {
                        SetunassignModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Modal>

                {/* mark as completed modal  */}
                <Modal
                  open={completed}
                  onClose={() => {
                    SetCompleted(false);
                  }}
                >
                  <Box sx={style} className="flex flex-col gap-2">
                    <p className="text-center font-semibold">
                      Rate you experience with the worker
                    </p>
                    <hr />
                    <div className="flex flex-col gap-1">
                      <label className="text-sm m-0 font-medium text-gray-700">
                        Rating
                      </label>{" "}
                      <div className="flex">
                        {" "}
                        <Rating
                          name="hover-feedback"
                          value={stars}
                          precision={1}
                          getLabelText={getLabelText}
                          onChange={(event, newValue) => {
                            setValue(newValue);
                          }}
                          onChangeActive={(event, newHover) => {
                            setHover(newHover);
                          }}
                          emptyIcon={
                            <StarIcon
                              style={{ opacity: 0.55 }}
                              fontSize="inherit"
                            />
                          }
                        />
                        {stars !== null && (
                          <Box sx={{ ml: 2 }}>
                            {labels[hover !== -1 ? hover : stars]}
                          </Box>
                        )}
                      </div>
                    </div>

                    <div>
                      {" "}
                      <label
                        htmlFor="description"
                        className="text-sm m-0 font-medium text-gray-700"
                      >
                        Comment
                      </label>
                      <Textarea
                        name="description"
                        id="description"
                        placeholder="Add comment"
                        value={comment}
                        onChange={handleCommentChange}
                        className="w-full h-20 overflow-y-scroll scrollbar-hide"
                        required
                      />
                      <p className="text-gray-400">
                        {200 - comment.length} characters remaining
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="price"
                        className="text-sm m-0 font-medium text-gray-700"
                      >
                        Price charged by the worker
                      </label>
                      <Input
                        id="address"
                        name="address"
                        value={price}
                        onChange={(e) => SetPrice(e.target.value)}
                        placeholder="Price"
                        type="number"
                        className="w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        onClick={() => {
                          HandleCompleteRequest(data.assignedTo._id);
                          SetCompleted(false);
                        }}
                      >
                        Submit
                      </Button>
                      <Button
                        onClick={() => {
                          SetCompleted(false);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
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
