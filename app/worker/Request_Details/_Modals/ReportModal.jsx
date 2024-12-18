"use client";
import React, { useState } from "react";
import { Textarea } from "@mui/joy";
import Box from "@mui/material/Box";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportRequest } from "../_FetchFunction/ReportRequest";
import { useAuth } from "@/app/_context/UserAuthContent";
import { toast } from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};

const ReportModal = ({ handleClose, rid }) => {
  const [IssueType, SetIssueType] = useState("");
  const [description, setDescription] = useState("");
  const auth = useAuth();

  const handleIssueTypeChange = (value) => {
    SetIssueType(value);
  };

  async function Report() {
    try {
      const authString = localStorage.getItem("auth");
      const auth = JSON.parse(authString);
      const data = await ReportRequest(
        auth?.user?._id,
        rid,
        IssueType,
        description
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error while reporting:", error);
      toast.error(
        "An error occurred while submitting the report. Please try again."
      );
    }
  }

  return (
    <Box sx={style} className="w-[280px] sm:w-[400px]">
      <p className="w-full text-center mb-2 text-2xl font-bold">Report request</p>
      <div className="flex flex-col items-center justify-center gap-3">
        <Select
          required
          onValueChange={handleIssueTypeChange}
          value={IssueType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select issue" />
          </SelectTrigger>
          <SelectContent className="z-[1500]">
            <SelectItem value="electrician">
              The request is irrelevent
            </SelectItem>
            <SelectItem value="carpenter">the image is irrelevent</SelectItem>
            <SelectItem value="plumber">
              Description and other details are not proper
            </SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          name="description"
          placeholder="give description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-40 overflow-y-scroll scrollbar-hide"
          required
        />
        <div className="w-full flex flex-col gap-2 ">
          {" "}
          <Button
            onClick={() => {
              Report();
            }}
          >
            Submit Report
          </Button>
          <Button onClick={handleClose}>Close</Button>{" "}
        </div>
      </div>
    </Box>
  );
};

export default ReportModal;
