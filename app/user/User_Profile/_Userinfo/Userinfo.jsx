"use client";
import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Upload, Image } from "antd";
import Input from "@mui/joy/Input";
import { Button } from "@/components/ui/button";
import { GetUserInfo } from "./fetchfunction/GetUserInfo";
import { useAuth } from "../../../_context/UserAuthContent";
import { UpdateUserInfo } from "@/server/controllers/UserController";
import { Toaster, toast } from "react-hot-toast";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Userinfo = () => {
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [auth, setAuth] = useAuth();

  // State to hold input field values
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    pincode: "",
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Simulating fetching user data including image
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

        // Fetch image and set in fileList if it exists
        const imageUrl = `http://localhost:8000/api/v1/request/GetRequestPhotoController/${auth?.user?._id}`;
        setFileList([
          {
            uid: "-1",
            name: "user-photo.png",
            status: "done",
            url: imageUrl,
          },
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updateuserdata() {
    try {
      const response = await GetUserInfo(auth?.user?._id, formData);
      if (response.data.success) {
        setAuth({
          ...auth, //spread auth to keep previous values as it is
          user: response.data.updateduser,
        });

        localStorage.setItem(
          "auth",
          JSON.stringify({
            ...auth,
            user: response.data.updateduser,
          })
        );
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(response.data.message);
    }
  }

  useEffect(() => {
    if (auth?.user?._id) {
      getuserdata();
    }
  }, [auth]);

  // Handle image preview
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // Handle image change (limit to one image)
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)); // Keep only the last uploaded file
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className="w-full ">
      <Toaster></Toaster>
      <div className="flex flex-col justify-center gap-4  border-2 border-gray-300 m-auto w-[85%]  lg:w-3/4 xl:w-1/2 rounded-lg p-5">
        <p className="text-2xl font-medium">Personal Information</p>
        <hr />
        <div className="flex flex-col justify-center">
          <p className="font-medium">Upload Image</p>
          <Upload
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture-circle"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            maxCount={1} // Restrict upload to one file
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>

        <hr />
        <div className="flex flex-col gap-2">
          {/* Name and mobile number */}
          <div className="flex sm:flex-row  flex-col  gap-4">
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
          <div className="flex sm:flex-row  flex-col  gap-4">
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
          <div className="flex sm:flex-row  flex-col  gap-4">
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
              <Button>Save</Button>
              {/* onClick={updateuserdata} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userinfo;
