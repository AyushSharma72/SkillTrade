"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import toast, { Toaster } from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WorkerRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceType, setServiceType] = useState(""); // To store the selected service type

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleServiceTypeChange = (value) => {
    setServiceType(value);
  };

  async function RegisterWorker(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const Name = formData.get("Name");
    const MobileNo = formData.get("MobileNumber");
    const Address = formData.get("Address");
    const Password = formData.get("Password");
    const Pincode = formData.get("Pincode");

    // Ensure that the service type is selected
    if (!serviceType) {
      toast.error("Please select a service type");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/v1/workers/WorkerRegister",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name,
            MobileNo,
            Address,
            Password,
            ServiceType: serviceType,
            Pincode,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setLoading(false);
        toast.success(result.message);
        event.target.reset();
      } else {
        setLoading(false);
        toast.error(result.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Please try again");
    }
  }

  return (
    <div className="flex flex-col items-center ">
      <Toaster />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <form
        className="w-full flex justify-center flex-col items-center gap-y-5 mt-5 formshadow py-2 rounded-md"
        onSubmit={RegisterWorker}
      >
        <p className="font-bold text-2xl ">Create Worker Account</p>
        <TextField
          id="standard-basic"
          label="Name"
          variant="outlined"
          className="w-3/4"
          required
          type="text"
          name="Name"
        />
        <TextField
          id="standard-basic"
          label="Mobile Number"
          variant="outlined"
          className="w-3/4"
          required
          type="tel"
          inputProps={{ maxLength: 10 }}
          name="MobileNumber"
        />
        <TextField
          id="standard-basic"
          label="Full Address"
          variant="outlined"
          className="w-3/4"
          required
          type="text"
          name="Address"
        />
        <TextField
          id="standard-basic"
          label="Area Pincode"
          variant="outlined"
          className="w-3/4"
          required
          type="number"
          name="Pincode"
        />
        <TextField
          id="standard-password"
          label="Password"
          variant="outlined"
          className="w-3/4"
          required
          type={showPassword ? "text" : "password"}
          name="Password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Select required onValueChange={handleServiceTypeChange}>
          <SelectTrigger className="w-3/4">
            <SelectValue placeholder="Select Service Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electrician">Electrician</SelectItem>
            <SelectItem value="carpenter">Carpenter</SelectItem>
            <SelectItem value="plumber">Plumber</SelectItem>
            <SelectItem value="painter">Painter</SelectItem>
            <SelectItem value="gardener">Gardener</SelectItem>
            <SelectItem value="mechanic">Mechanic</SelectItem>
            <SelectItem value="locksmith">Locksmith</SelectItem>
            <SelectItem value="handyman">Handyman</SelectItem>
            <SelectItem value="welder">Welder</SelectItem>
            <SelectItem value="pest_control">Pest Control</SelectItem>
            <SelectItem value="roofer">Roofer</SelectItem>
            <SelectItem value="tiler">Tiler</SelectItem>
            <SelectItem value="appliance_repair">Appliance Repair</SelectItem>
            <SelectItem value="flooring_specialist">
              Flooring Specialist
            </SelectItem>
          </SelectContent>
        </Select>

        <Button>Register</Button>
      </form>
    </div>
  );
};

export default WorkerRegisterForm;
