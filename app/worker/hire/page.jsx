"use client";
import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  Pagination,
} from "@mui/material";
import { Tag } from "antd";
import { useAuth } from "@/app/_context/UserAuthContent";
import { ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import moment from "moment";
import toast from "react-hot-toast";
import Empty from "../../assests/Empty.svg";
import { Button } from "../../../components/ui/button";
import { StyledTableCell, StyledTableRow } from "../../_Arrays/Arrays";
import Image from "next/image";
import { IoCall } from "react-icons/io5";

const HiringRequest = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const fetchHiringRequests = async () => {
      if (!auth?.user?._id) return;
      setLoading(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/workers/HiringRequest/${auth.user._id}?page=${pageNumber}&limit=5`
        );
        const result = await response.json();

        if (response.ok) {
          setData(result.hiringRequests);
          setTotalPages(result.totalPages);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to fetch hiring requests");
      }
      setLoading(false);
    };

    if (auth) {
      fetchHiringRequests();
    } else {
      const storedAuth = JSON.parse(localStorage.getItem("auth"));
      if (storedAuth) {
        setAuth(storedAuth);
      }
    }
  }, [auth, pageNumber]);

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  return (
    <div>
      {loading ? (
        <p className="text-2xl text-center mt-10">Loading...</p>
      ) : data.length > 0 ? (
        <div className="flex flex-col justify-center items-center  mt-20 sm:mt-0">
          <p className="text-3xl mt-5 leading-6">Hiring requests</p>
          <TableContainer className="cursor-pointer sm:mt-5 mt-10 m-auto justify-center flex flex-col pb-3">
            <Table aria-label="customized table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">Description</StyledTableCell>
                  <StyledTableCell align="center">
                    Visiting Date
                  </StyledTableCell>
                  <StyledTableCell align="center">Time</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Address</StyledTableCell>
                  <StyledTableCell align="center">Created By</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <StyledTableRow key={item._id || index}>
                    <StyledTableCell align="center">
                      {item.description}
                    </StyledTableCell>
                    {/* visiting date  */}
                    <StyledTableCell align="center">
                      {moment(item.visitingDate).format("MMMM Do YYYY")}
                    </StyledTableCell>

                    {/* time  */}
                    <StyledTableCell align="center">
                      {item.time}
                    </StyledTableCell>

                    {/* status  */}
                    <StyledTableCell align="center">
                      {item.status === "Pending" ? (
                        <Tag icon={<ClockCircleOutlined />} color="warning">
                          {item.status}
                        </Tag>
                      ) : item.status === "Accepted" ? (
                        <Tag icon={<CheckCircleOutlined />} color="blue">
                          {item.status}
                        </Tag>
                      ) : item.status === "Rejected" ? (
                        <Tag icon={<CheckCircleOutlined />} color="red">
                          {item.status}
                        </Tag>
                      ) : item.status === "Completed" ? (
                        <Tag icon={<CheckCircleOutlined />} color="purple">
                          {item.status}
                        </Tag>
                      ) : null}
                    </StyledTableCell>
                    {/* address */}
                    <StyledTableCell align="center">
                      <a
                        href={
                          item.coordinates?.coordinates?.length === 2
                            ? `https://www.google.com/maps?q=${item.coordinates.coordinates[1]},${item.coordinates.coordinates[0]}`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                item.address
                              )}`
                        }
                        target="_blank"
                        className="text-blue-500"
                      >
                        {item.address}
                      </a>
                    </StyledTableCell>

                    {/* creation date  */}
                    <StyledTableCell align="center">
                      {item?.user?.Name} on{" "}
                      {moment(item.Creationdate).format("MMMM Do YYYY")}
                    </StyledTableCell>
                    {/* contact  */}
                    <StyledTableCell align="center">
                      <Button
                        onClick={() => {
                          window.location.href = `tel:${item?.user.MobileNo?.toString()}`;
                        }}
                      >
                        <IoCall className="mr-1" />
                        Contact
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            className="mt-5"
            count={totalPages}
            page={pageNumber}
            color="primary"
            onChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="w-full flex-col gap-5 justify-center flex h-[500px] items-center mt-10">
          <Image src={Empty} height={400} width={400}></Image>
          <p className="text-2xl">No, Hiring request for you </p>
          <Link href="/">
            <Button>Home</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HiringRequest;
