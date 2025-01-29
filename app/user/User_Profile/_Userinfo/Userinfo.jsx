"use client";
import React, { useState, useEffect } from "react";
import Input from "@mui/joy/Input";
import { Button } from "@/components/ui/button";
import { GetUserInfo } from "./fetchfunction/GetUserInfo";
import { useAuth } from "../../../_context/UserAuthContent";
import { UpdateUserInfo } from "./fetchfunction/UpdateUserInfo";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input as Otp } from "antd";
import { Typography } from "antd";
const { Title } = Typography;

const Userinfo = () => {
  const [auth, setAuth] = useAuth();
  const [openmodal, SetOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    pincode: "",
  });
  const [GeneratedOtp, SetGeneratedOtp] = useState("");
  const [otp, setOtp] = useState("");
  const [Loading, SetLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [emailVerified, SetEmailVerified] = useState(false);
  const [imgurl, SetImgUrl] = useState(
    `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/users/GetUserImage/${auth?.user?._id}`
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const onChange = (text) => {
    setOtp(text);
  };
  const sharedProps = {
    onChange,
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  async function getuserdata() {
    try {
      const response = await GetUserInfo(auth?.user?._id);
      if (response.data.success) {
        SetEmailVerified(response.data.user.email_verified);
        setFormData({
          name: response.data.user.Name || "",
          mobile: response.data.user.MobileNo || "",
          email: response.data.user.Email || "",
          address: response.data.user.Address || "",
          pincode: response.data.user.Pincode || "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateuserdata() {
    if (auth?.user?._id) {
      try {
        setOpenBackdrop(true);
        const data = new FormData();
        data.append("Name", formData.name);
        data.append("MobileNo", formData.mobile);
        data.append("Email", formData.email);
        data.append("Address", formData.address);
        data.append("Pincode", formData.pincode);

        if (imageFile) data.append("image", imageFile);

        if (!/^\d{6}$/.test(formData.pincode)) {
          toast.error("Pincode must be exactly 6 digits");
          return;
        }

        const response = await UpdateUserInfo(auth?.user?._id, data);

        if (response.success) {
          setAuth({
            ...auth,
            user: response.updateduser,
          });

          localStorage.setItem(
            "auth",
            JSON.stringify({
              ...auth,
              user: response.updateduser,
            })
          );
          toast.success(response.message);
          SetImgUrl(
            `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/users/GetUserImage/${auth?.user?._id}`
          );
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while updating user info");
      } finally {
        setOpenBackdrop(false);
      }
    }
  }

  function generateOTP(length = 6) {
    SetGeneratedOtp(Math.floor(100000 + Math.random() * 900000).toString());
  }

  async function SendOtp(email) {
    try {
      SetOpenModal(false);
      setOpenBackdrop(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/users/SendEmailVerificationOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ GeneratedOtp, email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        SetOpenModal(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setOpenBackdrop(false);
    }
  }

  const verifyOtp = async (email) => {
    if (!otp) {
      toast.error("OTP is required");
      return;
    }
    try {
      SetLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/users/VerifyOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            foremail: true,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("verification successfull");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      SetLoading(false);
      SetOpenModal(false);
    }
  };

  useEffect(() => {
    if (auth?.user?._id) getuserdata();
  }, [auth]);

  return (
    <div className="flex justify-center items-center  bg-gray-50">
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        {emailVerified ? null : (
          <Alert severity="warning">
            your email is unverified please verify your email.{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => {
                generateOTP();
                if (GeneratedOtp) {
                  SendOtp(auth?.user?.Email);
                }
              }}
            >
              Verify
            </span>
          </Alert>
        )}
        <p className="text-2xl font-semibold text-gray-800 text-center">
          Personal Information
        </p>
        <hr className="my-4" />

        {/* Profile Image */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src={imgurl}
            alt="User Profile"
            className="w-[200px] h-[200px] rounded-full object-cover shadow"
            width={228}
            height={228}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            size="md"
            className="w-full"
          />
        </div>

        {/* Form Fields */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="font-medium text-gray-700">Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                size="md"
                placeholder="Enter your name"
              />
            </div>
            <div className="flex-1">
              <label className="font-medium text-gray-700">Mobile Number</label>
              <Input
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                size="md"
                placeholder="Enter your mobile number"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex-1">
              <label className="font-medium text-gray-700">Email </label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                size="md"
                disabled
              />
            </div>
            <div className="flex-1">
              <label className="font-medium text-gray-700">Address</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                size="md"
                placeholder="Enter your address"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 items-center">
            <div className="flex-1">
              <label className="font-medium text-gray-700">Pincode</label>
              <Input
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                size="md"
                type="number"
                placeholder="Enter your pincode"
              />
            </div>
            <Button onClick={updateuserdata} className="px-6 py-2 mt-4">
              Save
            </Button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/">
            <Button className="px-4 py-2">Home</Button>
          </Link>
        </div>
      </div>

      <Backdrop open={openBackdrop} className="z-50">
        <CircularProgress color="primary" />
      </Backdrop>

      {/* modal for emial verification  */}
      <AlertDialog open={openmodal}>
        <AlertDialogContent className="p-6 w-[400px] rounded-lg shadow-lg">
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-lg font-semibold">
              Verify Email
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-sm">
              We sent an OTP to your registered email{" "}
              <strong>({auth?.user?.Email})</strong>. Please enter it below to
              verify your email.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col items-center gap-4 mt-4">
            <Title level={5} className="text-gray-700">
              Enter OTP
            </Title>
            <Otp.OTP
              formatter={(str) => str.toUpperCase()}
              {...sharedProps}
              className="border rounded-lg p-2 text-center text-lg"
            />

            <Button
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => {
                verifyOtp(auth?.user?.Email);
              }}
              disabled={Loading}
            >
              {Loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify"
              )}
            </Button>

            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => {
                generateOTP();
                if (GeneratedOtp) {
                  SendOtp(auth?.user?.Email);
                }
              }}
            >
              Resend OTP
            </button>
          </div>

          <AlertDialogFooter className="flex justify-end mt-4">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={() => SetOpenModal(false)}
            >
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Userinfo;
