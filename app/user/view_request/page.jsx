"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useAuth } from "@/app/_context/UserAuthContent";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { Tag } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import Pagination from "@mui/material/Pagination";
import GetRequestData from "./GetRequestData";
import { PulseLoader } from "react-spinners";
import Empty from "../../assests/Empty.svg";
import Image from "next/image";
import Link from "next/link";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ViewRequest() {
  const [auth, setauth] = useAuth();
  const [data, setdata] = useState([]);
  const [pages, SetPages] = useState(1);
  const [pageNumber, SetPageNumber] = useState(1);
  const [loading, setloading] = useState(false);

  const handlePageChange = (event, value) => {
    SetPageNumber(value);
  };

  async function GetData() {
    try {
      setloading(true);
      const info = await GetRequestData(auth?.user?._id, pageNumber);

      if (info.success) {
        setdata(info.requests);

        SetPages(Math.ceil(info.totalRequests / 5));
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
    if (auth?.user?._id && pageNumber) {
      GetData();
    }
  }, [pageNumber, auth]);

  return (
    <div>
      <Toaster />
      {loading ? (
        <div className="h-[600px] w-full  flex  ">
          <PulseLoader size={20} className="m-auto" />
        </div>
      ) : data.length > 0 ? (
        <div>
          <p className="text-3xl text-center sm:mt-3  mt-20 font-bold">
            Requests
          </p>
          <TableContainer className="cursor-pointer sm:mt-5  mt-10 m-auto xl:!w-3/4  justify-center flex flex-col items-center pb-3">
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Service type</StyledTableCell>
                  <StyledTableCell align="center">Location</StyledTableCell>
                  <StyledTableCell align="center">
                    Visiting Date
                  </StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((data) => (
                  <StyledTableRow>
                    <StyledTableCell component="th" scope="row" align="center">
                      {data.service}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {data.location}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {" "}
                      <div className="flex flex-col">
                        <span className="font-bold">
                          {moment(data.date).format("MMMM Do YYYY")}
                        </span>
                      </div>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {data.status === "Pending" ? (
                       
                          <Tag icon={<ClockCircleOutlined />} color="warning">
                            {data.status}
                          </Tag>
                    
                      ) : (
                       
                          <Tag icon={<CheckCircleOutlined />} color="success">
                            {data.status}
                          </Tag> 
                      )}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Link href={`Request_Details/${data._id}`}>
                        <Button>View</Button>
                      </Link>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              className="mt-5"
              count={pages}
              page={pageNumber}
              color="primary"
              onChange={handlePageChange}
            />
          </TableContainer>
        </div>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          <p className="font-bold text-3xl text-center mt-10">No Data</p>
          <Image src={Empty} className="w-[400px] h-[400px] m-auto" />
          <Link href="/">
            <Button>Home</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
