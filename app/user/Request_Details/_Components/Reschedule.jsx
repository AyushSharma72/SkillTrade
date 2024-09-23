"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
// import { useAuth } from "@/app/_context/UserAuthContent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UpdateRequest from "../_FetchFunction/EditRequest";
import { useParams } from "next/navigation";

const Reschedule = () => {
  const [loading, setLoading] = useState(false);
  // const [auth, setauth] = useAuth();
  const minDate = new Date();
  const [date, setdate] = useState("");
  const [time, settime] = useState("");
  const [address, setAddress] = useState("");
  const { rid } = useParams();

  async function Update(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await UpdateRequest(date, time, address, rid);
      if (response.success) {
        toast.success(response.message);
        // Reset all fields to null values
        setdate(null);
        settime("");
        setAddress("");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating the request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Toaster />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <p className="font-bold text-2xl">Reschedule Request</p>

      <form
        onSubmit={Update}
        className="w-[90%] sm:w-3/4 lg:w-1/2 flex justify-center flex-col items-center gap-y-5 mt-5 formshadow py-5 rounded-md"
      >
        <div className="w-full flex flex-col gap-2 justify-center items-center">
          <label
            className="block mb-2 font-medium text-start w-3/4"
            htmlFor="date"
          >
            Select Date
          </label>
          <div className="w-3/4">
            <DatePicker
              id="date"
              onChange={(date) => setdate(date)}
              selected={date}
              className="border border-gray-300 w-64  p-2 rounded-md"
              placeholderText="Select date"
              minDate={minDate}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 justify-center items-center">
          <label
            className="block mb-2 font-medium text-start w-3/4"
            htmlFor="time"
          >
            Select Time
          </label>
          <input
            id="time"
            type="time"
            className="p-2 border-2 border-gray-300 rounded-md w-3/4"
            value={time}
            onChange={(e) => settime(e.target.value)}
            placeholder="Select time"
          />
        </div>

        <div className="w-full flex flex-col gap-2 justify-center items-center">
          <label
            className="block mb-2 font-medium text-start w-3/4"
            htmlFor="address"
          >
            Edit Address
          </label>
          <TextField
            id="standard-basic"
            label="Edit Address"
            variant="outlined"
            className="w-3/4"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            name="Address"
          />
        </div>

        <Button type="submit">Reschedule</Button>
      </form>
    </div>
  );
};

export default Reschedule;
