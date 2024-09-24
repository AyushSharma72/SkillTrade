"use client";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UpdateRequest from "../_FetchFunction/EditRequest";
import { useParams } from "next/navigation";
import reschedule from "../../../assests/reschedule.svg";
import Image from "next/image";
import GetRequestData from "../_FetchFunction/GetRequestData";

const Reschedule = () => {
  const [loading, setLoading] = useState(false);
  const minDate = new Date();
  const [date, setdate] = useState("");
  const [time, settime] = useState("");
  const [address, setAddress] = useState("");
  const { rid } = useParams();

  async function Update(e) {
    if (!time && !date && !address) {
      toast.error("please enter atleast one field");
      return;
    }

    e.preventDefault();
    setLoading(true);
    try {
      const response = await UpdateRequest(date, time, address, rid);
      if (response.success) {
        toast.success(response.message);

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

  async function GetData() {
    try {
      setLoading(true);
      const info = await GetRequestData(rid);

      if (info.success) {
        setdate(info.requestdetails.date);
        settime(info.requestdetails.time);
        setAddress(info.requestdetails.location);
      } else {
        toast.error(info.message);
      }
    } catch (error) {
      toast.error("Please try again");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    GetData();
  }, []);

  return (
    <div className="flex-col flex justify-around items-center sm:flex-col md:flex-row p-3">
      <Toaster />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Image
        src={reschedule}
        className="lg:w-[400px] lg:h-[400px] w-[200px] h-[200px] md:w-[300px] md:h-[300px]"
      />
      <div className="w-full sm:w-[90%] lg:w-1/2">
        <p className="font-bold text-2xl text-center">Reschedule Request</p>

        <form
          onSubmit={Update}
          className="flex justify-center flex-col items-center gap-y-5 mt-5 formshadow py-5 rounded-md"
        >
          <div className="w-full flex flex-col gap-2 justify-center items-center">
            <label
              className="block mb-2 font-medium text-start w-3/4"
              htmlFor="date"
            >
              Edit Date
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
              Edit Time
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
    </div>
  );
};

export default Reschedule;
