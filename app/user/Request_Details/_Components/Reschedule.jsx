"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "@/app/_context/UserAuthContent";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Reschedule = () => {
  const [loading, setLoading] = React.useState(false);
  const [auth, setauth] = useAuth();
  const minDate = new Date();
  const [date, setdate] = useState("");
  const [time, settime] = useState("");

  return (
    <div className="flex flex-col  items-center">
      <Toaster />
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <p className="font-bold text-2xl">Reschedule Request</p>

      <form className=" w-[90%] sm:w-3/4 lg:w-1/2 flex justify-center flex-col items-center gap-y-5 mt-5 formshadow py-5 rounded-md">
        <DatePicker
          onChange={(date) => setdate(date)}
          selected={date}
          className="border border-gray-300 w-3/4 p-2 rounded-md"
          placeholderText="Select date"
          minDate={minDate}
          dateFormat="dd/MM/yyyy"
        />
        <input
          type="time"
          className="p-2 border-2 border-gray-300 rounded-md w-3/4"
          value={time}
          onChange={(e) => {
            settime(e.target.value);
          }}
          placeholder="select time"
        />
        <TextField
          id="standard-basic"
          label="Edit Address"
          variant="outlined"
          className="w-3/4"
          type="text"
          name="Address"
        />

        <Button>Update</Button>
      </form>
    </div>
  );
};

export default Reschedule;
