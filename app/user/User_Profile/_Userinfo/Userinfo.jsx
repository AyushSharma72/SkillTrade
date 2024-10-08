"use client";
import React, { useState, useEffect } from "react";
import Input from "@mui/joy/Input";
import { Button } from "@/components/ui/button";
import { GetUserInfo } from "./fetchfunction/GetUserInfo";
import { useAuth } from "../../../_context/UserAuthContent";
import { UpdateUserInfo } from "./fetchfunction/UpdateUserInfo";
import { Toaster, toast } from "react-hot-toast";

const Userinfo = () => {
  const [auth, setAuth] = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    pincode: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  async function getuserdata() {
    try {
      const response = await GetUserInfo(auth?.user?._id);
      if (response.data.success) {
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
        const data = new FormData();

        data.append("Name", formData.name);
        data.append("MobileNo", formData.mobile);
        data.append("Email", formData.email);
        data.append("Address", formData.address);
        data.append("Pincode", formData.pincode);

        if (imageFile) {
          data.append("image", imageFile);
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
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while updating user info");
      }
    }
  }

  useEffect(() => {
    if (auth?.user?._id) {
      getuserdata();
    }
  }, [auth]);

  return (
    <div className="w-full">
      <Toaster />
      <div className="flex flex-col justify-center gap-4 border-2 border-gray-300 m-auto w-[85%] lg:w-3/4 xl:w-1/2 rounded-lg p-5">
        <p className="text-2xl font-medium">Personal Information</p>
        <hr />

        {/* Image Upload Field */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Profile Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            size="md"
          />
        </div>

        <hr />
        <div className="flex flex-col gap-2">
          {/* Name and mobile number */}
          <div className="flex sm:flex-row flex-col gap-4">
            <div className="flex flex-col gap-2 sm:w-1/2 ">
              <label className="font-medium">Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                size="md"
              />
            </div>
            <div className="flex flex-col gap-2 sm:w-1/2">
              <label className="font-medium">Mobile Number</label>
              <Input
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                size="md"
              />
            </div>
          </div>

          {/* Email and address */}
          <div className="flex sm:flex-row flex-col gap-4">
            <div className="flex flex-col gap-2 sm:w-1/2">
              <label className="font-medium">Email</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                size="md"
                disabled
              />
            </div>
            <div className="flex flex-col gap-2 sm:w-1/2">
              <label className="font-medium">Address</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                size="md"
              />
            </div>
          </div>

          {/* Pincode */}
          <div className="flex sm:flex-row flex-col gap-4">
            <div className="flex flex-col gap-2 sm:w-1/2">
              <label className="font-medium">Pincode</label>
              <Input
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                size="md"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/4 justify-end">
              <Button onClick={updateuserdata}>Save</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userinfo;
