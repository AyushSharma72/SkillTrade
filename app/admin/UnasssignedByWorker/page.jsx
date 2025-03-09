"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamic Imports
const Table = dynamic(() => import("@mui/material/Table"), { ssr: false });
const TableBody = dynamic(() => import("@mui/material/TableBody"), {
  ssr: false,
});
const TableContainer = dynamic(() => import("@mui/material/TableContainer"), {
  ssr: false,
});
const TableHead = dynamic(() => import("@mui/material/TableHead"), {
  ssr: false,
});
const TableRow = dynamic(() => import("@mui/material/TableRow"), {
  ssr: false,
});
const Paper = dynamic(() => import("@mui/material/Paper"), { ssr: false });
const Pagination = dynamic(() => import("@mui/material/Pagination"), {
  ssr: false,
});
const Collapse = dynamic(() => import("@mui/material/Collapse"), {
  ssr: false,
});
const Typography = dynamic(() => import("@mui/material/Typography"), {
  ssr: false,
});
const IconButton = dynamic(() => import("@mui/material/IconButton"), {
  ssr: false,
});
const { KeyboardArrowUp, KeyboardArrowDown } = dynamic(
  () => import("@mui/icons-material"),
  { ssr: false }
);
const Link = dynamic(() => import("next/link"), { ssr: false });
const Image = dynamic(() => import("next/image"), { ssr: false });

const toast = dynamic(() => import("react-hot-toast"), { ssr: false });
const Toaster = dynamic(
  () => import("react-hot-toast").then((mod) => mod.Toaster),
  { ssr: false }
);

const isAdmin = dynamic(
  () => import("../../_components/privateroutes/isAdmin"),
  { ssr: false }
);
const Empty = dynamic(() => import("../../assests/Empty.svg"), { ssr: false });

const Button = dynamic(() => import("@/components/ui/button"), { ssr: false });
const AlertDialog = dynamic(
  () => import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialog),
  { ssr: false }
);
const AlertDialogContent = dynamic(
  () =>
    import("@/components/ui/alert-dialog").then(
      (mod) => mod.AlertDialogContent
    ),
  { ssr: false }
);
const AlertDialogHeader = dynamic(
  () =>
    import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogHeader),
  { ssr: false }
);
const AlertDialogTitle = dynamic(
  () =>
    import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogTitle),
  { ssr: false }
);
const AlertDialogDescription = dynamic(
  () =>
    import("@/components/ui/alert-dialog").then(
      (mod) => mod.AlertDialogDescription
    ),
  { ssr: false }
);
const AlertDialogFooter = dynamic(
  () =>
    import("@/components/ui/alert-dialog").then((mod) => mod.AlertDialogFooter),
  { ssr: false }
);

const StyledTableCell = dynamic(
  () => import("../../_Arrays/Arrays").then((mod) => mod.StyledTableCell),
  { ssr: false }
);

const WorkersTable = ({ role }) => {
  const [workers, setWorkers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openRows, setOpenRows] = useState({});
  const [banModal, setBanModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    fetchWorkers(currentPage);
  }, [currentPage]);

  const fetchWorkers = async (page) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/admin/getWorkersWithUnAssignedRequests/${page}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setWorkers(data.data);
        setTotalPages(data.totalPages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const banWorker = async () => {
    if (!selectedWorker) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/admin/banWorker/${selectedWorker}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Worker banned for 3 days");
        fetchWorkers(currentPage);
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error banning worker:", error);
      toast.error("Failed to ban worker. Please try again.");
    }

    setBanModal(false);
    setBanReason("");
  };

  async function ValidateUnassignedRequest(rid) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/admin/ValidateUnassignedRequest/${rid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("error try again");
    }
  }

  const handleOpenBanModal = (workerId) => {
    setSelectedWorker(workerId);
    setBanModal(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <Toaster />
      <AlertDialog open={banModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will ban this worker for the next 3 days
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setBanModal(false)}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={banWorker}
            >
              Ban for 3 days
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {workers?.length > 0 ? (
        <>
          <TableContainer className="mt-6 mx-auto" component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell />
                  <StyledTableCell align="center">Worker Name</StyledTableCell>
                  <StyledTableCell align="center">
                    Total Unassigned Requests
                  </StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workers?.map((worker) => (
                  <React.Fragment key={worker._id}>
                    <TableRow>
                      <StyledTableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() =>
                            setOpenRows((prev) => ({
                              ...prev,
                              [worker._id]: !prev[worker._id],
                            }))
                          }
                        >
                          {openRows[worker._id] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {worker.Name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {worker.UnAssignedRequest.length} times
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div className="flex justify-center gap-2">
                          <Link href={`/worker/worker_profile/${worker._id}`}>
                            <Button className="text-white px-4 py-1 rounded">
                              View Profile
                            </Button>
                          </Link>
                          <Button
                            className="text-white px-4 py-1 rounded bg-red-500 hover:bg-red-700"
                            onClick={() => handleOpenBanModal(worker._id)}
                            disabled={worker.Banned.ban}
                          >
                            {worker.Banned.ban ? "Banned" : "Ban Worker"}
                          </Button>
                        </div>
                      </StyledTableCell>
                    </TableRow>
                    {openRows[worker._id] && (
                      <TableRow>
                        <StyledTableCell
                          colSpan={5}
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                        >
                          <Collapse
                            in={openRows[worker._id]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <div className="p-4">
                              <Typography variant="h6" gutterBottom>
                                Unassigned Requests Details
                              </Typography>
                              <Table size="small" aria-label="nested table">
                                <TableHead>
                                  <TableRow>
                                    <StyledTableCell align="center">
                                      Request ID
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      Unassigned Reason
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      Unassigned Date
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                      Unassigned Date
                                    </StyledTableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {worker?.UnAssignedRequest?.map((request) => (
                                    <TableRow key={request.request}>
                                      <StyledTableCell align="center">
                                        <Link
                                          href={`/worker/Request_Details/${request.request}`}
                                          className="text-blue-600"
                                        >
                                          View Request
                                        </Link>
                                      </StyledTableCell>
                                      <StyledTableCell align="center">
                                        {request.unassignReason || "N/A"}
                                      </StyledTableCell>
                                      <StyledTableCell align="center">
                                        {request.unassignesAt
                                          ? new Date(
                                              request.unassignesAt
                                            ).toLocaleDateString()
                                          : "N/A"}
                                      </StyledTableCell>
                                      <StyledTableCell align="center">
                                        <Button
                                          className="text-white px-4 py-1 rounded"
                                          onClick={() => {
                                            ValidateUnassignedRequest(
                                              request.request
                                            );
                                          }}
                                        >
                                          Validate
                                        </Button>
                                      </StyledTableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </Collapse>
                        </StyledTableCell>
                      </TableRow>
                    )}
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
        <div className="flex flex-col items-center gap-5">
          <Typography variant="h5" className="mt-4 mb-4 text-center">
            No workers found with unassigned requests
          </Typography>
          <Image src={Empty} alt="No Data" width={500} height={400} />
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default isAdmin(WorkersTable);
