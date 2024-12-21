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
import Pagination from "@mui/material/Pagination";
import { GetAcceptedByData } from "../_FetchFunction/AcceptedByData";
import { PulseLoader } from "react-spinners";
import Empty from "../../../assests/Empty.svg";
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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function AcceptedBy() {
  const [auth, setAuth] = useAuth();
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  async function fetchData() {
    try {
      setLoading(true);
      const info = await GetAcceptedByData(auth?.user?._id, pageNumber);

      if (info.success) {
        setData(info.requests);
        setPages(Math.ceil(info.total / 5));
      } else {
        toast.error(info.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Please try again");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (auth?.user?._id && pageNumber) {
      fetchData();
    }
  }, [pageNumber, auth]);

  return (
    <div>
      <Toaster />
      {loading ? (
        <div className="h-[600px] w-full flex">
          <PulseLoader size={20} className="m-auto" />
        </div>
      ) : data.length > 0 ? (
        <div>
          <p className="text-3xl text-center sm:mt-3 mt-20 font-bold">
            Requests
          </p>
          <TableContainer className="cursor-pointer sm:mt-5 mt-10 m-auto xl:!w-3/4 justify-center flex flex-col items-center pb-3">
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Worker Name</StyledTableCell>
                  <StyledTableCell align="center">
                    Estimated Price
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Price Justification
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((request) =>
                  request.acceptedBy.map((accepted) => (
                    <StyledTableRow>
                      <StyledTableCell align="center">
                        {accepted.worker.Name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {accepted.estimatedPrice} Rs
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {accepted.priceJustification ? (
                          accepted.priceJustification
                        ) : (
                          <span className="text-red-600">Not provided</span>
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Link href="">
                          <Button title="assign this job to this worker">
                            Assign
                          </Button>
                        </Link>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
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
          <Image
            src={Empty}
            className="w-[400px] h-[400px] m-auto"
            alt="No Data"
          />
          <Link href="/">
            <Button>Home</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default AcceptedBy;
