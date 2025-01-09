"use client";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
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
import { GetRequestFilteredData } from "./GetRequestFilteredData";
import { PulseLoader } from "react-spinners";
import Empty from "../../assests/Empty.svg";
import Image from "next/image";
import Link from "next/link";
// import UserPrivateRoutes from "./../../_components/privateroutes/UserPrivateRoutes"; // use later
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import SmallScreennmodal from "./SmallScreenmodal";
import Paper from "@mui/material/Paper";
import { StyledTableCell, StyledTableRow } from "../../_Arrays/Arrays";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TbFilterSearch } from "react-icons/tb";

function ViewRequest() {
  const [auth, setauth] = useAuth();
  const [data, setdata] = useState([]);
  const [pages, SetPages] = useState(1);
  const [pageNumber, SetPageNumber] = useState(1);
  const [loading, setloading] = useState(false);
  const [ServiceType, setServiceType] = useState("");
  const [checkedValues, setCheckedValues] = useState({
    nearBy: false,
    yourCity: false,
  });
  const [Disabled, setDisabled] = useState(null);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [WorkerCoordinates, SetWorkerCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  //  get location
  useEffect(() => {
    // Prompt user for location and save coordinates to localStorage
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // Save to localStorage
            localStorage.setItem(
              "userCoordinates",
              JSON.stringify({ latitude, longitude })
            );
          },
          (error) => {
            console.error("Error fetching location:", error.message);
            toast.error(
              "Unable to fetch location. Please enable location services."
            );
          }
        );
      } else {
        toast.error("Geolocation is not supported by your browser.");
      }
    };

    getUserLocation();
    const userCoordinates = JSON.parse(localStorage.getItem("userCoordinates"));
    if (userCoordinates) {
      const latitude = userCoordinates.latitude;
      const longitude = userCoordinates.longitude;
      SetWorkerCoordinates({
        latitude: latitude,
        longitude: longitude,
      });
    } else {
      console.log("No user coordinates found in localStorage.");
    }
  }, []);

  const handleServiceTypeChange = (value) => {
    setServiceType(value);
  };
  const handlePageChange = (event, value) => {
    SetPageNumber(value);
  };

  async function GetData() {
    try {
      setloading(true);
      const response = await fetch(
        `http://localhost:8000/api/v1/request/Allrequests/${pageNumber}`
      );
      const info = await response.json();
      if (info.success) {
        setdata(info.requests);
        SetPages(Math.ceil(info?.totalrequests / 5));
      } else {
        toast.error(info.message);
      }
    } catch (error) {
      toast.error("please try again");
    } finally {
      setloading(false);
    }
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    return distance.toFixed(2);
  }

  const checkCity = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/workers/CheckCity/${auth?.user?._id}`
      );
      const data = await response.json();

      if (data.success) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } catch (error) {
      console.error("Error checking city:", error);
      setDisabled(false);
    }
  };

  async function GetFilteredData() {
    try {
      setloading(true);

      const info = await GetRequestFilteredData(
        ServiceType,
        checkedValues,
        auth?.user?._id
      );

      if (info.success) {
        setdata(info.requests);
      } else {
        toast.error(info.message);
      }
    } catch (error) {
      toast.error("please try again");
    } finally {
      setloading(false);
    }
  }

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setCheckedValues((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  useEffect(() => {
    if (ServiceType || checkedValues.nearBy || checkedValues.yourCity) {
      GetFilteredData();
      checkCity();
    } else {
      GetData();
      checkCity();
    }
  }, [pageNumber, auth, ServiceType, checkedValues]);

  return (
    <div>
      <Toaster />
      <div className="lg:flex lg:flex-row p-5 flex flex-col ">
        {/* Filters */}
        <div className="lg:w-1/4 flex flex-row lg:flex lg:flex-col gap-2 items-start mt-20 sm:mt-0">
          <span
            className="flex sm:hidden lg:flex items-center gap-1 font-bold cursor-pointer sm:pointer-events-none"
            onClick={handleOpen}
          >
            <TbFilterSearch />
            Apply Filters{" "}
            <span>
              {ServiceType ? <Tag color="default">{ServiceType}</Tag> : null}
            </span>
            <span>
              {checkedValues.nearBy ? <Tag color="default">NearBy</Tag> : null}
            </span>
            <span>
              {checkedValues.yourCity ? (
                <Tag color="default">YourCity</Tag>
              ) : null}
            </span>
          </span>

          {/* modal filter small screen */}
          <SmallScreennmodal
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
            handleServiceTypeChange={handleServiceTypeChange}
            ServiceType={ServiceType}
            handleChange={handleChange}
            Disabled={Disabled}
            checkedValues={checkedValues}
          />

          <div className="w-full sm:flex flex-col gap-4 hidden">
            <p className="font-semibold">Service type</p>
            <Select
              required
              onValueChange={handleServiceTypeChange}
              value={ServiceType}
            >
              <SelectTrigger className="w-3/4">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electrician">Electrician</SelectItem>
                <SelectItem value="carpenter">Carpenter</SelectItem>
                <SelectItem value="plumber">Plumber</SelectItem>
                <SelectItem value="painter">Painter</SelectItem>
                <SelectItem value="gardener">Gardener</SelectItem>
                <SelectItem value="mechanic">Mechanic</SelectItem>
                <SelectItem value="locksmith">Locksmith</SelectItem>
                <SelectItem value="handyman">Handyman</SelectItem>
                <SelectItem value="welder">Welder</SelectItem>
                <SelectItem value="pest_control">Pest Control</SelectItem>
                <SelectItem value="roofer">Roofer</SelectItem>
                <SelectItem value="tiler">Tiler</SelectItem>
                <SelectItem value="appliance_repair">
                  Appliance Repair
                </SelectItem>
                <SelectItem value="flooring_specialist">
                  Flooring Specialist
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="w-1/2"
              onClick={() => {
                setServiceType("");
              }}
            >
              Clear service filter
            </Button>
          </div>

          <div className="w-full sm:flex flex-col hidden  mt-3">
            <p className="font-semibold">Location</p>
            <FormControlLabel
              name="nearBy"
              control={<Checkbox />}
              checked={checkedValues.nearBy}
              onChange={handleChange}
              label="Near By"
            />
            <FormControlLabel
              name="yourCity"
              control={<Checkbox disabled={Disabled} />}
              label="Your City"
              checked={checkedValues.yourCity}
              onChange={handleChange}
            />
            {Disabled ? (
              <p className="text-red-600">
                update your city to enable this filter
              </p>
            ) : null}
            <Button
              className="w-1/2"
              onClick={() => {
                setCheckedValues({
                  nearBy: false,
                  yourCity: false,
                });
              }}
            >
              Clear Locations
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="h-[600px] w-full flex">
            <PulseLoader size={20} className="m-auto" />
          </div>
        ) : data?.length > 0 ? (
          // Requests
          <div className="lg:w-3/4 w-full ">
            <p className="text-3xl text-center sm:mt-3 mt-10 font-bold">
              All Requests
            </p>
            <TableContainer className="cursor-pointer mt-2 " component={Paper}>
              <Table aria-label="customized table" sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      Service type
                    </StyledTableCell>
                    <StyledTableCell align="center">Location</StyledTableCell>
                    <StyledTableCell align="center">
                      Visiting Date
                    </StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                    <StyledTableCell align="center">Distance</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((data) => (
                    <StyledTableRow key={data._id}>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        align="center"
                      >
                        {data.service}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {data.location}
                      </StyledTableCell>
                      <StyledTableCell align="center">
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
                        ) : data.status === "Accepted" ? (
                          <Tag icon={<CheckCircleOutlined />} color="blue">
                            {data.status}
                          </Tag>
                        ) : data.status === "Assigned" ? (
                          <Tag icon={<CheckCircleOutlined />} color="success">
                            {data.status}
                          </Tag>
                        ) : data.status === "Completed" ? (
                          <Tag icon={<CheckCircleOutlined />} color="purple">
                            {data.status}
                          </Tag>
                        ) : data.status === "Deleted" ? (
                          <Tag icon={<CheckCircleOutlined />} color="red">
                            {data.status}
                          </Tag>
                        ) : null}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {WorkerCoordinates.latitude &&
                        data.coordinates?.coordinates[1]
                          ? `${calculateDistance(
                              WorkerCoordinates.latitude,
                              WorkerCoordinates.longitude,
                              data.coordinates?.coordinates[1],
                              data.coordinates?.coordinates[0]
                            )} km away`
                          : <span className="text-red-500">not availiable</span>}{" "}
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
            </TableContainer>
            {ServiceType ||
            checkedValues.nearBy ||
            checkedValues.yourCity ? null : (
              <Pagination
                className="mt-5 flex justify-center"
                count={pages}
                page={pageNumber}
                color="primary"
                onChange={handlePageChange}
              />
            )}
          </div>
        ) : (
          <div className="sm:w-3/4 flex flex-col justify-center items-center">
            <p className="font-bold text-3xl text-center mt-10">No Data</p>
            <Image src={Empty} className="w-[400px] h-[400px] m-auto" />
            <Link href="/">
              <Button>Home</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewRequest;
