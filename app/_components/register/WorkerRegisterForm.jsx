"use client";
import React from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WorkerRegisterForm = () => {
  return (
    <div className="flex flex-col  items-center">
      <p className="font-bold text-2xl mt-5">Create Worker Account</p>
      <form className=" w-full flex justify-center flex-col items-center gap-y-10 mt-5">
        <TextField
          id="standard-basic"
          label="Name"
          variant="outlined"
          className="w-3/4"
          required
          type="text"
        />
        <TextField
          id="standard-basic"
          label="Mobile Number"
          variant="outlined"
          className="w-3/4"
          required
          type="tel"
          inputProps={{ maxLength: 10 }}
        />

        <TextField
          id="standard-basic"
          label="Full Address"
          variant="outlined"
          className="w-3/4"
          required
          type="text"
        />
        <Select required>
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
