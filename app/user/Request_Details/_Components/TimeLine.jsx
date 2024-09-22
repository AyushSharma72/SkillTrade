"use client";
import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { FaCheck } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import Typography from "@mui/material/Typography";
import GetRequestData from "../_FetchFunction/GetRequestData";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const TimeLine = () => {
  const [data, setdata] = useState([]);
  const [loading, setloading] = useState(true);
  const { rid } = useParams();

  async function GetData() {
    try {
      setloading(true);
      const info = await GetRequestData(rid);

      if (info.success) {
        setdata(info.requestdetails);
        setloading(false);
      } else {
        toast.error(info.message);
        setloading(false);
      }
    } catch (error) {
      toast.error("please try again");
      setloading(false);
    }
  }

  useEffect(() => {
    GetData();
  }, []);

  return (
    <>
      <p className="font-bold text-2xl text-center">Request Timeline</p>

      {loading ? (
        <Box sx={{ display: "flex" }} className="mt-5 w-full justify-center">
          <CircularProgress />
        </Box>
      ) : (
        <Timeline position="alternate">
          <TimelineItem>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color="success">
                <FaCheck />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography variant="h6" component="span">
                Request Created
              </Typography>
              <Typography>
                A request was created by you
                <Typography>
                  {data.date
                    ? moment(data.date).format("MMMM Do YYYY")
                    : "No date available"}
                </Typography>
              </Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color="warning">
                <FaRegClock />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography variant="h6" component="span">
                Pending
              </Typography>
              <Typography>Waiting till someone accepts your request</Typography>
              <Typography>
                {data.date
                  ? moment(data.date).format("MMMM Do YYYY")
                  : "No date available"}
              </Typography>
            </TimelineContent>
          </TimelineItem>

          <TimelineItem>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot color="success">
                <FaCheck />
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography variant="h6" component="span">
                Accepted
              </Typography>
              <Typography>Your request was accepted</Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      )}
    </>
  );
};

export default TimeLine;
