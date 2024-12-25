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
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useParams } from "next/navigation";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};
function AcceptedBy() {
  const [auth] = useAuth();
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { rid } = useParams();
  const currentDate = new Date();
  const handlePageChange = (event, value) => {
    setPageNumber(value);
  };

  async function fetchData() {
    if (loading) return;

    try {
      setLoading(true);
      const info = await GetAcceptedByData(rid, pageNumber);

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
  async function AssignTask(e, wid) {
    e.preventDefault();
    try {
      setLoading2(true);
      const response = await fetch(
        `http://localhost:8000/api/v1/request/AssignRequest/${rid}/${wid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: currentDate,
          }),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("error try again");
    } finally {
      setLoading2(false);
    }
  }
  useEffect(() => {
    if (auth?.user?._id && pageNumber) {
      fetchData();
    }
  }, [pageNumber, auth?.user?._id]);

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
            Requests Accepted By
          </p>
          {data[0].assignedTo ? (
            <div className="text-center p-2 sm:w-1/2 md:w-1/4  m-auto rounded-md bg-green-300 mt-2">
              <p className="font-semibold">
                This request is already assigned to a worker !
              </p>
            </div>
          ) : null}
          <TableContainer className="cursor-pointer sm:mt-5 mt-10 m-auto xl:!w-3/4 justify-center flex flex-col pb-3">
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
                    <StyledTableRow key={accepted.worker.Name}>
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
                      <StyledTableCell className="!flex justify-center gap-2">
                        {request.assignedTo ? null : (
                          <Button
                            title="assign this job to this worker"
                            onClick={handleOpen}
                          >
                            Assign
                          </Button>
                        )}

                        <Button>View profile</Button>

                        {/* modal */}
                        <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="Assign modal"
                          aria-describedby="used t o assign task to the worker "
                        >
                          <Box sx={style} className="flex flex-col gap-2 ">
                            <p className="text-center">
                              Please check all the details before assigning the
                              task to the worker !{" "}
                            </p>

                            <Button
                              title="assign this job to this worker"
                              onClick={(e) => {
                                AssignTask(e, accepted.worker._id);
                                if (!loading2) {
                                  handleClose();
                                }
                              }}
                            >
                              Assign
                            </Button>
                            <Button onClick={handleClose}>Close</Button>
                          </Box>
                        </Modal>
                        {/* backdrop */}
                        <Backdrop
                          sx={(theme) => ({
                            color: "#fff",
                            zIndex: theme.zIndex.drawer + 1,
                          })}
                          open={loading2}
                        >
                          <CircularProgress color="inherit" />
                        </Backdrop>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="flex justify-center">
              <Pagination
                className="mt-5"
                count={pages}
                page={pageNumber}
                color="primary"
                onChange={handlePageChange}
              />
            </div>
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
