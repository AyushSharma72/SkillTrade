"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Input, Textarea } from "@mui/joy";
import { Button as CustomButton } from "@/components/ui/button";
import Button from "@mui/joy/Button";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import SvgIcon from "@mui/joy/SvgIcon";
import StepLabel from "@mui/material/StepLabel";
import { styled } from "@mui/joy";
import { useAuth } from "@/app/_context/UserAuthContent";
import { services, steps } from "../../_Arrays/Arrays";
import Image from "next/image";
import Link from "next/link";
import UserPrivateRoutes from "../../_components/privateroutes/UserPrivateRoutes";
import { useSearchParams } from "next/navigation";
import Avatar from "@mui/material/Avatar";

// Dynamically import problematic libraries
const Select = dynamic(() => import("react-select"), { ssr: false });
const DatePicker = dynamic(() => import("react-datepicker"), { ssr: false });
const Toaster = dynamic(
  () => import("react-hot-toast").then((mod) => mod.Toaster),
  { ssr: false }
);
const toast = dynamic(
  () => import("react-hot-toast").then((mod) => mod.toast),
  { ssr: false }
);

// react-icons doesn't support dynamic import, so import this way
import { MdDeleteOutline } from "react-icons/md";

const CreateRequest = () => {
  //mui
  const [activeStep, setActiveStep] = useState(0);

  //form data
  const [service, setService] = useState(null);
  const [customService, setCustomService] = useState("");
  const [description, setDescription] = useState("");
  const [time, settime] = useState("");
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [customLocation, setCustomLocation] = useState("");
  const [date, setdate] = useState("");
  const [coordinates, setCoordinates] = useState(""); // Updated to store coordinates
  // useful states
  const [isCustomService, setIsCustomService] = useState(false);
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [pincode, Setpincode] = useState(null);
  const [city, Setcity] = useState("");

  const searchParams = useSearchParams();
  const workerId = searchParams.get("id");
  const workerName = searchParams.get("name");
  const expertise = searchParams.get("expertise");
  const defaultService = services.find((s) => s.value === expertise) || null;
  const minDate = new Date();
  const [auth, setAuth] = useAuth();

  const locations = [
    {
      value: `${auth?.user?.Address}`,
      label: `Your account address (${auth?.user?.Address})`,
    },
    { value: "current", label: "Your current location" },
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage({ file, url: imageUrl });
    }
  };

  const getHumanReadableAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const readableAddress = data.display_name || "Unknown Location";
      return readableAddress;
    } catch (error) {
      console.error("Error fetching human-readable address:", error.message);
      return "Unknown Location";
    }
  };

  const handleLocationChange = async (selectedLocation) => {
    setLocation(selectedLocation);

    if (selectedLocation.value === "current") {
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
            });
          });

          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });

          const address = await getHumanReadableAddress(latitude, longitude);
          setCustomLocation(address);
        } catch (error) {
          console.error("Error getting location:", error);
          setCustomLocation("Unknown Location");
        }
      } else {
        console.error("Geolocation is not supported by this browser.");
        setCustomLocation("Geolocation not supported");
      }
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!description || !time || !date) {
      toast.error("All fields are required");
      return;
    }
    if (
      (!location && !customLocation) ||
      (!service && !customService && !defaultService)
    ) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("user", auth.user._id);
    formData.append(
      "service",
      isCustomService
        ? customService
        : defaultService
        ? defaultService.value
        : service?.value
    );
    formData.append("description", description);
    formData.append("image", image?.file ? image.file : null);
    formData.append("time", time);
    formData.append("date", date);
    formData.append(
      "location",
      location?.value === "current" || isCustomLocation
        ? customLocation
        : location?.value
    );
    formData.append("pincode", pincode);
    formData.append("city", city);
    formData.append("coordinates", JSON.stringify(coordinates));
    formData.append("workerid", workerId);
    try {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/request/CreateRequest`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await request.json();

      if (result.success) {
        toast.success(result.message);
        setActiveStep(3);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Please try again");
    }
  }

  const isStepOptional = (step) => step === 1;

  return (
    <Box sx={{ width: "100%" }}>
      <Toaster position="bottom-center" reverseOrder={false} />
      <p className="w-full text-center font-bold text-3xl mt-20 sm:mt-4 flex justify-center ">
        Create Request
        {workerId && workerName && (
          <span className="flex ml-2 gap-2 items-center">
            To Hire{" "}
            <Avatar
              src={`${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/workers/GetWorkerImage/${workerId}`}
              sx={{ width: 35, height: 35 }}
            />{" "}
            {workerName}
          </span>
        )}
      </p>
      <Stepper
        activeStep={activeStep}
        className="xl:w-1/2 sm:w-3/4 w-[90%] m-auto mt-10"
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <div className="flex flex-col justify-center items-center gap-y-4 h-[500px]">
          <p className="font-bold text-2xl">Request submitted</p>
          <Image src="/success.svg" className="w-[300px]"></Image>
          <Link href="/user/view_request">
            <CustomButton>View request</CustomButton>
          </Link>
        </div>
      ) : (
        <React.Fragment>
          <form
            onSubmit={handleSubmit}
            className="xl:w-1/2 sm:w-3/4 w-[90%] mt-4 mb-10 flex flex-col gap-y-3 justify-center p-4 formshadow items-center rounded-md m-auto"
          >
            {activeStep === 0 && (
              <React.Fragment>
                <Select
                  required
                  options={services}
                  isDisabled={defaultService ? true : isCustomService}
                  value={defaultService || service}
                  onChange={setService}
                  className="w-full"
                  placeholder="Select service"
                />
                <div className="flex gap-3 items-center justify-center w-full">
                  <p className="font-bold text-red-600">
                    Service not available?
                  </p>
                  <CustomButton
                    type="button"
                    onClick={() => setIsCustomService(!isCustomService)}
                  >
                    {isCustomService ? "Revert" : "Add custom service"}
                  </CustomButton>
                </div>
                {isCustomService && (
                  <Input
                    name="custom_service"
                    value={customService}
                    onChange={(e) => setCustomService(e.target.value)}
                    placeholder="Request custom service"
                    className="w-full"
                    required
                  />
                )}
                <Textarea
                  name="description"
                  placeholder="Describe your problem"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-40 overflow-y-scroll scrollbar-hide"
                  required
                />
              </React.Fragment>
            )}
            {activeStep === 1 && (
              <React.Fragment>
                <div className="flex flex-col items-center mt-4 w-full">
                  <Button
                    component="label"
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
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {image && (
                    <div className="mt-2 flex">
                      <img
                        src={image.url}
                        alt="Uploaded preview"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                      <MdDeleteOutline
                        className="text-red-600 text-xl cursor-pointer"
                        onClick={() => setImage(null)}
                      />
                    </div>
                  )}
                </div>
              </React.Fragment>
            )}
            {activeStep === 2 && (
              <div className="w-full flex flex-col gap-6">
                <Select
                  required
                  options={locations}
                  isDisabled={isCustomLocation}
                  value={location}
                  onChange={handleLocationChange} // Use the new handler
                  className="w-full"
                  placeholder="Select location"
                />

                <div className="flex gap-3 items-center justify-center w-full">
                  <p className="font-bold text-red-600">
                    Need service somewhere else?
                  </p>
                  <CustomButton
                    type="button"
                    onClick={() => setIsCustomLocation(!isCustomLocation)}
                  >
                    {isCustomLocation ? "Revert" : "Add custom location"}
                  </CustomButton>
                </div>
                {isCustomLocation && (
                  <Input
                    name="custom_location"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Enter custom location"
                    className="w-full"
                  />
                )}
                <input
                  type="number"
                  className="p-2 border-2 border-gray-300 rounded-md"
                  value={pincode}
                  onChange={(e) => {
                    Setpincode(e.target.value);
                  }}
                  placeholder="Area Pincode"
                />
                <input
                  type="text"
                  className="p-2 border-2 border-gray-300 rounded-md"
                  value={city}
                  onChange={(e) => {
                    Setcity(e.target.value);
                  }}
                  placeholder="City"
                />

                <DatePicker
                  onChange={(date) => setdate(date)}
                  selected={date}
                  className="border border-gray-300 w-full p-2 rounded-md"
                  placeholderText="Select date"
                  minDate={minDate}
                  dateFormat="dd/MM/yyyy"
                />

                <input
                  type="time"
                  className="p-2 border-2 border-gray-300 rounded-md"
                  value={time}
                  onChange={(e) => {
                    settime(e.target.value);
                  }}
                  placeholder="select time"
                />
              </div>
            )}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleNext} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )}
              <Button
                onClick={
                  activeStep === steps.length - 1 ? handleSubmit : handleNext
                }
              >
                {activeStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </Box>
          </form>
        </React.Fragment>
      )}
    </Box>
  );
};

export default UserPrivateRoutes(CreateRequest);
