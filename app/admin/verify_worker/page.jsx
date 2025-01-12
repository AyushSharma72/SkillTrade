"use client";
import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import Image from "next/image";
import Link from "next/link";
import {
  Typography,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { Button } from "../../../components/ui/button";
import { StyledTableCell, StyledTableRow } from "../../_Arrays/Arrays";
import { RxCross1 } from "react-icons/rx";
import Empty from "../../assests/Empty.svg";


const Page = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");


  const fetchPageData = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/admin/get_verifying_requests?page=${page}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: 2,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setRequests(data.requests || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchPageData(page);
  };

  const handleOpenModal = (wid) => {
    setSelectedImage(
      `http://localhost:8000/api/v1/admin/get_veriify_id/${wid}`
    );
    setImageLoading(true);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setOpenModal(false);
  };



  // const handleRejectRequest = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8000/api/v1/admin/reject_request/${selectedRequestId}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           rejectionReason,
  //         }),
  //       }
  //     );
  //     const data = await response.json();
  //     if (data.success) {
  //       // Refresh data after successful rejection
  //       fetchPageData(currentPage);
  //     } else {
  //       console.error("Failed to reject request:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error rejecting request:", error);
  //   } finally {
  //     handleCloseRejectModal();
  //   }
  // };

  useEffect(() => {
    fetchPageData(currentPage);
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <PulseLoader size={20} />
        </div>
      ) : requests && requests.length > 0 ? (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            Pending Verification Requests
          </Typography>
          <TableContainer className="mt-6">
            <Table aria-label="customized table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">Worker Name</StyledTableCell>
                  <StyledTableCell align="center">Mobile No</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">View ID</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <StyledTableRow key={request._id}>
                    <StyledTableCell align="center">
                      <Link
                        href={`/worker/worker_profile/${request._id}`}
                        className="text-blue-600"
                      >
                        {request.Name}
                      </Link>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {request.MobileNo || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {request.Verified.verified || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button onClick={() => handleOpenModal(request._id)}>
                        View ID
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <div className="flex gap-2 justify-center">
                        <Button>Verify</Button>
                        <Button
                          className="bg-red-600 hover:bg-red-500"
                          onClick={()=>{setOpenRejectModal(true)}}
                        >
                          Reject
                        </Button>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
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
          <Typography variant="h5" className="mb-4">
            No pending verification requests.
          </Typography>
          <Image src={Empty} alt="No Data" width={300} height={300} />
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      )}

      {/* Modal for Viewing ID */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Worker ID</DialogTitle>
        <RxCross1
          className="absolute top-5 right-2 cursor-pointer"
          onClick={handleCloseModal}
        />
        <DialogContent>
          {imageLoading && (
            <div className="flex justify-center my-4 text-lg">
              Loading <PulseLoader size={15} />
            </div>
          )}
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="ID"
              width={500}
              height={500}
              onLoadingComplete={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal for Rejection */}
   
    </div>
  );
};

export default Page;
