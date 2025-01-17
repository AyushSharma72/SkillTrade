"use client";
import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import Image from "next/image";
import Link from "next/link";
import {
  Typography,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Backdrop,
  CircularProgress,
  Box,
} from "@mui/material";
import { Button } from "../../../components/ui/button";
import { MdDelete } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import Empty from "../../assests/Empty.svg";
import { toast, Toaster } from "react-hot-toast";
import { StyledTableCell, style } from "../../_Arrays/Arrays";
import Modal from "@mui/material/Modal";
import { Textarea } from "@mui/joy";
import { BsPersonFillCheck } from "react-icons/bs";
import { ImCross } from "react-icons/im";

const Page = ({ role }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [backdrop, setBackdrop] = useState(false);
  const [openRows, setOpenRows] = useState({});
  const [infomodal, SetInfoModal] = useState(false);
  const [openmodal, SetOpenModal] = useState(false);
  const [rejectReviewModal, SetRejectReviewModal] = useState(false);
  const [requestId, SetRequestId] = useState("");
  const [info, SetInfo] = useState("");

  useEffect(() => {
    fetchPageData(currentPage);
  }, [currentPage]);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleToggleRow = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchPageData = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/admin/view_reports?page=${page}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: 2 }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
      }
      if (data.success) {
        setReports(data.reports || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setReports([]);
        setTotalPages(1);
      }
    } catch (error) {
      setReports([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // delete request
  async function deleteRequest() {
    const apiUrl = `http://localhost:8000/api/v1/admin/delete_request/${requestId}`;
    setBackdrop(true);
    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        SetOpenModal(false);
        toast.success(result.message);
        fetchPageData(currentPage);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error occurred while deleting");
    } finally {
      SetRequestId(null);
      setBackdrop(false); // Hide the backdrop
    }
  }

  // inform user
  async function informUser() {
    const apiUrl = `http://localhost:8000/api/v1/admin/inform_user/${requestId}`;
    setBackdrop(true);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ info }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        fetchPageData(currentPage);
        SetInfoModal(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An Error occurred");
    } finally {
       SetRequestId(null);
      setBackdrop(false); // Hide the backdrop
    }
  }

  // reject review

  async function rejectReviewRequest() {
    try {
      setBackdrop(true);
      const response = await fetch(
        `http://localhost:8000/api/v1/admin/reject_review/${requestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ info }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
       SetRequestId(null);
      setBackdrop(false); // Hide the backdrop
    }
  }

  // approve review
  async function approveRequest() {
    try {
      setBackdrop(true);
      const response = await fetch(
        `http://localhost:8000/api/v1/admin/approve_review/${requestId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
       SetRequestId(null);
      setBackdrop(false); // Hide the backdrop
    }
  }

  return (
    <div className=" mx-auto p-4 sm:m-0 mt-20">
      <Toaster />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <PulseLoader size={20} />
        </div>
      ) : reports && reports.length > 0 ? (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            Reported Requests
          </Typography>
          <TableContainer className="mt-6 mx-auto" component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell />
                  <StyledTableCell align="center">Request ID</StyledTableCell>
                  <StyledTableCell align="center">
                    Number of times reported
                  </StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                  <StyledTableCell align="center">Review</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <React.Fragment key={report._id}>
                    <TableRow>
                      <StyledTableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleToggleRow(report._id)}
                        >
                          {openRows[report._id] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {" "}
                        <Link
                          href={`/worker/Request_Details/${report.requestId}`}
                          className="text-blue-700"
                        >
                          {report.requestId}
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {report.Report.length} times
                      </StyledTableCell>

                      {/* actions  */}
                      <StyledTableCell align="center">
                        <div className="flex gap-3 justify-center items-center">
                          {report.ReviewRequested ? null : (
                            <IoIosInformationCircle
                              className="text-xl cursor-pointer text-blue-700"
                              title="Inform User"
                              onClick={() => {
                                SetRequestId(report.requestId);
                                SetInfoModal(true);
                              }}
                            />
                          )}
                          <MdDelete
                            className="text-xl cursor-pointer text-red-600"
                            title="Delete Request"
                            onClick={() => {
                              SetRequestId(report.requestId);
                              SetOpenModal(true);
                            }}
                          />
                        </div>
                      </StyledTableCell>

                      {/* reviews  */}

                      <StyledTableCell align="center">
                        {report.ReviewRequested ? (
                          <div className="flex flex-col gap-2">
                            <span>A review is requested by the user</span>
                            <div className="flex gap-4 justify-center items-center">
                              {" "}
                              {/* <BsPersonFillCheck
                                title="Approving this review will remove this request from reported request"
                                className="cursor-pointer text-2xl text-green-600"
                              /> */}
                              <Button
                                title="Approving this review will remove this request from reported request"
                                onClick={() => {
                                  SetRequestId(report.requestId);
                                  if (requestId) {
                                    approveRequest();
                                  }
                                }}
                              >
                                {" "}
                                Approve
                              </Button>
                              <Button
                                title="reject the review request of the user"
                                onClick={() => {
                                  SetRequestId(report.requestId);
                                  SetRejectReviewModal(true);
                                }}
                              >
                                Reject
                              </Button>
                              {/* <ImCross
                                title="reject the review request of the user"
                                className="cursor-pointer text-xl text-red-600"
                              /> */}
                            </div>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </StyledTableCell>
                    </TableRow>
                    <TableRow>
                      <StyledTableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={3}
                      >
                        <Collapse
                          in={openRows[report._id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <div className="p-4">
                            <Typography variant="h6" gutterBottom>
                              Report Details
                            </Typography>
                            <Table size="small" aria-label="nested table">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell align="center">
                                    Worker Name
                                  </StyledTableCell>
                                  <StyledTableCell align="center">
                                    Issue Type
                                  </StyledTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {report.Report.map((r) => (
                                  <TableRow key={r._id}>
                                    <StyledTableCell align="center">
                                      <Link
                                        href={`/worker/worker_profile/${r.worker._id}`}
                                        className="text-blue-600"
                                      >
                                        {r.worker.Name}
                                      </Link>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      {r.IssueType}
                                    </StyledTableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </Collapse>
                      </StyledTableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex justify-center mt-4">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <Typography variant="h5" className="mb-4 text-center">
            No Reported Requests
          </Typography>
          <Image src={Empty} alt="No Data" width={300} height={300} />
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* delete modal  */}

      <Modal
        open={openmodal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="flex flex-col gap-2 sm:w-[400px] w-[320px]">
          <p className="font-bold text-center">
            Are you sure you want to delete this request ?
          </p>{" "}
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
              deleteRequest();
            }}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              SetOpenModal(false);
            }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* info modal  */}

      <Modal
        open={infomodal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="flex flex-col gap-2 sm:w-[400px] w-[300px] !p-5"
        >
          <p className="text-center text-xl">Inform User</p>{" "}
          <Textarea
            name="description"
            placeholder="Inform the user about problem in the request"
            value={info}
            onChange={(e) => SetInfo(e.target.value)}
            className="w-full h-40 overflow-y-scroll scrollbar-hide"
            required
          />
          <Button
            onClick={() => {
              informUser();
            }}
          >
            Inform
          </Button>
          <Button
            onClick={() => {
              SetInfoModal(false);
            }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* rejectReviewModal */}

      <Modal
        open={rejectReviewModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="flex flex-col gap-2 sm:w-[400px] w-[300px] !p-5"
        >
          <p className="text-center text-xl">Reject Request</p>{" "}
          <Textarea
            name="description"
            placeholder="Enter reason for rejection"
            value={info}
            onChange={(e) => SetInfo(e.target.value)}
            className="w-full h-40 overflow-y-scroll scrollbar-hide"
            required
          />
          <Button
            onClick={() => {
              rejectReviewRequest();
            }}
            className="bg-red-600"
          >
            Reject
          </Button>
          <Button
            onClick={() => {
              SetRejectReviewModal(false);
            }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Page;
