"use client";
import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import isAdmin from "@/app/_components/privateroutes/isAdmin"; //use later
import Image from "next/image";
import Link from "next/link";
import {
  Typography,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Empty from "../../assests/Empty.svg";
import { Button } from "../../../components/ui/button";
import { StyledTableCell, StyledTableRow } from "../../_Arrays/Arrays";
import { RxCross1 } from "react-icons/rx";

const page = () => {
  const [requests, setRequests] = useState();
  const [loading, setLoading] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

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
        console.error("Failed to fetch data:", data.message);
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

  useEffect(() => {
    fetchPageData(currentPage);
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <PulseLoader size={20}  />
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
                  <StyledTableCell align="center">Address</StyledTableCell>
                  <StyledTableCell align="center">Mobile No</StyledTableCell>
                  <StyledTableCell align="center">View ID</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <StyledTableRow key={request._id}>
                    <StyledTableCell align="center">
                          <Link href={`/worker/worker_profile/${request._id}`} className="text-blue-600">
                         {request.Name}
                        </Link>
                      
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {request.Address || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {request.MobileNo || "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button onClick={() => handleOpenModal(request._id)}>
                        View ID
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <div className="flex gap-2 justify-center">
                    
                        <Button type="primary">Verify</Button>
                        <Button type="primary">Reject</Button>
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

      {/* Modal */}
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
    </div>
  );
};

export default page;
