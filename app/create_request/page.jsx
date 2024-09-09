"use client";
import React, { useState } from "react";
import Select from "react-select";
import { Input, Textarea } from "@mui/joy";
import { Button as CustomButton } from "@/components/ui/button";
import Button from "@mui/joy/Button";
import SvgIcon from "@mui/joy/SvgIcon";
import { styled } from "@mui/joy";
import { MdDeleteOutline } from "react-icons/md";

const CreateRequest = () => {
  const [isDisabled, SetisDisabled] = useState(false);
  const [isCustom, SetisCustom] = useState(false);
  const [revert, Setrevert] = useState(false);
  const [image, setImage] = useState(null); // State to store the image file and preview

  function AddCustomService() {
    SetisDisabled(!isDisabled);
    SetisCustom(!isCustom);
    Setrevert(!revert);
  }

  const services = [
    { value: "electrician", label: "Electrician" },
    { value: "carpenter", label: "Carpenter" },
    { value: "plumber", label: "Plumber" },
    { value: "painter", label: "Painter" },
    { value: "gardener", label: "Gardener" },
    { value: "mechanic", label: "Mechanic" },
    { value: "locksmith", label: "Locksmith" },
    { value: "handyman", label: "Handyman" },
    { value: "welder", label: "Welder" },
    { value: "pest_control", label: "Pest Control" },
    { value: "roofer", label: "Roofer" },
    { value: "tiler", label: "Tiler" },
    { value: "appliance_repair", label: "Appliance Repair" },
    { value: "flooring_specialist", label: "Flooring Specialist" },
  ];

  const VisuallyHiddenInput = styled("input")`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
  `;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for the image file and update state
      const imageUrl = URL.createObjectURL(file);
      setImage({ file, url: imageUrl });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-1/2 mt-20 flex flex-col gap-y-3 justify-center">
        <div className="flex flex-col gap-y-3 justify-center">
          <Select
            required
            options={services}
            isDisabled={isDisabled}
            id="service_select"
            placeholder="Select service"
          />

          <div className="flex gap-3 items-center justify-center">
            <p className="font-bold text-red-600">Service not available?</p>
            <CustomButton onClick={() => AddCustomService()}>
              {revert ? "Revert" : "Add custom service"}
            </CustomButton>
          </div>

          {isCustom ? <Input placeholder="Request custom service" /> : null}

          <Textarea minRows={4} placeholder="Describe your problem" required />

          <div className="flex flex-col items-center mt-4 ">
            <Button
              component="label"
              role={undefined}
              tabIndex={-1}
              variant="outlined"
              color="neutral"
              className="w-full"
              startDecorator={
                <SvgIcon>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                </SvgIcon>
              }
            >
              Upload a file
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
            {image && (
              <div className="mt-2 flex">
                <img
                  src={image.url}
                  alt="Uploaded preview"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <MdDeleteOutline className="text-red-600 text-xl cursor-pointer" onClick={()=>{setImage(null)}}/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
