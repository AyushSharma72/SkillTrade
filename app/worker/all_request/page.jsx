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
import { GetRequestFilteredData } from "./GetRequestFilteredData";
import { PulseLoader } from "react-spinners";
import Empty from "../../assests/Empty.svg";
import Image from "next/image";
import Link from "next/link";
import UserPrivateRoutes from "./../../_components/privateroutes/UserPrivateRoutes";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TbFilterSearch } from "react-icons/tb";

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

  const handlePageChange = (event, value) => {
    SetPageNumber(value);
  };

  const handleServiceTypeChange = (value) => {
    setServiceType(value);
  };

  async function GetData() {
    try {
      setloading(true);
      const info = await GetRequestData(pageNumber);

      if (info.success) {
        setdata(info.requests);
        SetPages(Math.ceil(info?.totalrequests?.length / 5));
      } else {
        toast.error(info.message);
      }
    } catch (error) {
      toast.error("please try again");
    } finally {
      setloading(false);
    }
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
      <div className="flex p-5">
        {/* Filters */}
        <div className="w-1/4 flex flex-col gap-2 items-start">
          <span className="flex items-center gap-2 font-bold">
            <TbFilterSearch />
            Apply Filters
          </span>
          <div className="w-full flex flex-col gap-2">
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

          <div className="w-full flex flex-col">
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
          </div>

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

        {loading ? (
          <div className="h-[600px] w-3/4 flex">
            <PulseLoader size={20} className="m-auto" />
          </div>
        ) : data?.length > 0 ? (
          // Requests
          <div className="w-3/4">
            <p className="text-3xl text-center sm:mt-3 mt-20 font-bold">
              All Requests
            </p>
            <TableContainer className="cursor-pointerjustify-center flex flex-col items-center">
              <Table aria-label="customized table">
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
          <div className="w-3/4 flex flex-col justify-center items-center">
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

export default UserPrivateRoutes(ViewRequest);
