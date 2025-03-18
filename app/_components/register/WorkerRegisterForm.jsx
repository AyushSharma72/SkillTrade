"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import components that access `document`
const TextField = dynamic(() => import("@mui/material/TextField"), {
  ssr: false,
});
const IconButton = dynamic(() => import("@mui/material/IconButton"), {
  ssr: false,
});
const InputAdornment = dynamic(() => import("@mui/material/InputAdornment"), {
  ssr: false,
});
const Visibility = dynamic(() => import("@mui/icons-material/Visibility"), {
  ssr: false,
});
const VisibilityOff = dynamic(
  () => import("@mui/icons-material/VisibilityOff"),
  { ssr: false }
);
const Backdrop = dynamic(() => import("@mui/material/Backdrop"), {
  ssr: false,
});
const CircularProgress = dynamic(
  () => import("@mui/material/CircularProgress"),
  { ssr: false }
);
const PhoneInput = dynamic(() => import("react-phone-input-2"), { ssr: false });
const Toaster = dynamic(
  () => import("react-hot-toast").then((mod) => mod.Toaster),
  { ssr: false }
);

import { Button } from "@/components/ui/button";

// Ensure `@/components/ui/select` does not depend on `document`
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "react-phone-input-2/lib/style.css";

const WorkerRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: "", lon: "" });
  const API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleServiceTypeChange = (value) => {
    setServiceType(value);
  };

  const handleAddressChange = async (query) => {
    console.log("working");
    setAddress(query);
    if (query.length < 2) return;

    const response = await fetch(
      `https://autosuggest.search.hereapi.com/v1/autosuggest?at=28.6139,77.2090&q=${query}&apiKey=${API_KEY}`
    );
    const data = await response.json();
    setSuggestions(data.items || []);
  };

  const selectAddress = (place) => {
    setAddress(place.title);
    setCoordinates({ lat: place.position.lat, lon: place.position.lng });
    setSuggestions([]);
  };

  async function RegisterWorker(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const Name = formData.get("Name");
    const Email = formData.get("Email");
    const Password = formData.get("Password");
    const pincode = formData.get("pincode");

    if (!serviceType) {
      toast.error("Please select a service type");
      return;
    }
    if (Password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Pincode must be exactly 6 digits");
      return;
    }
    if (!address || !coordinates.lat || !coordinates.lon) {
      toast.error("Please select a valid address from the suggestions");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/workers/WorkerRegister`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name,
            Email,
            MobileNo: mobileNo,
            Address: address,
            Latitude: coordinates.lat,
            Longitude: coordinates.lon,
            Password,
            ServiceType: serviceType,
            pincode,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setLoading(false);
        toast.success(result.message);
        event.target.reset();
        setAddress("");
        setCoordinates({ lat: "", lon: "" });
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
    <div className="flex flex-col items-center mb-4">
      <Toaster position="bottom-center" reverseOrder={false} />
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
        <p className="font-bold text-2xl ">Create Service Provider Account</p>
        <TextField
          id="name"
          label="Name"
          variant="outlined"
          className="w-3/4"
          required
          type="text"
          name="Name"
        />
        <div className="w-3/4">
          <label className="text-sm text-gray-600 mb-1 block">
            Mobile Number
          </label>
          <PhoneInput
            country={"in"}
            value={mobileNo}
            onChange={(value) => setMobileNo(value)}
            inputStyle={{
              width: "100%",
              height: "56px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              paddingLeft: "48px",
            }}
            buttonStyle={{
              border: "none",
              borderRadius: "4px 0 0 4px",
            }}
          />
        </div>
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          className="w-3/4"
          required
          type="email"
          name="Email"
        />

        <div className="w-3/4 relative">
          <label className="text-sm text-gray-600 mb-1 block">
            Your closest working location
          </label>
          <TextField
            id="address"
            variant="outlined"
            className="w-full"
            required
            value={address}
            onChange={(e) => handleAddressChange(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 w-full z-10 max-h-48 overflow-auto">
              {suggestions.map((place, index) => (
                <li
                  key={index}
                  onClick={() => selectAddress(place)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {place.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        <TextField
          id="pincode"
          label="Area Pincode"
          variant="outlined"
          className="w-3/4"
          required
          type="number"
          inputProps={{ maxLength: 6 }}
          name="pincode"
        />
        <TextField
          id="password"
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
