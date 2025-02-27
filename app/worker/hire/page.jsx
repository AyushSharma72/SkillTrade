"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/_context/UserAuthContent";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Button,
  Pagination,
} from "@mui/material";
import { Tag } from "antd";
import { ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Link from "next/link";
import moment from "moment";


const HiringRequest = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [auth, useAuth] = useAuth();

  useEffect(() => {
    const fetchHiringRequests = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC__BASE_URL}/api/HiringRequest/${auth?.user?._id}?page=${pageNumber}&limit=5`
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

    fetchHiringRequests();
  }, [pageNumber]);

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <TableContainer className="cursor-pointer sm:mt-5 mt-10 m-auto justify-center flex flex-col pb-3">
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center">Visiting Date</TableCell>
                  <TableCell align="center">Time</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Created On</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={item._id || index}>
                    <TableCell align="center">{item.description}</TableCell>
                    <TableCell align="center">
                      {moment(item.visitingDate).format("MMMM Do YYYY")}
                    </TableCell>
                    <TableCell align="center">{item.time}</TableCell>
                    <TableCell align="center">
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
                    </TableCell>
                    <TableCell align="center">
                      {moment(item.Creationdate).format("MMMM Do YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <Link href={`Request_Details/${item._id}`}>
                        <Button>View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
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
        </>
      )}
    </div>
  );
};

export default HiringRequest;
