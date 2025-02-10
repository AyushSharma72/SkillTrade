"use client";
import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { MdVerifiedUser, MdOutlineLocationOn } from "react-icons/md";
import Rating from "@mui/material/Rating";
import { Tag } from "antd";
import { FaHandshake } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/_context/UserAuthContent";
import Pagination from "@mui/material/Pagination";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Hire = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ServiceType, setServiceType] = useState("");
  const [WorkerCoordinates, setWorkerCoordinates] = useState(null);
  const [auth, setAuth] = useAuth();

  // Function to get user location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const coordinates = { latitude, longitude };
            localStorage.setItem(
              "userCoordinates",
              JSON.stringify(coordinates)
            );
            resolve(coordinates);
          },
          (error) => {
            console.error("Error fetching location:", error.message);
            resolve(null);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        resolve(null);
      }
    });
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);

      // Get stored coordinates or fetch new ones
      let coordinates = JSON.parse(localStorage.getItem("userCoordinates"));
      let auth = JSON.parse(localStorage.getItem("auth"));
      let pincode = auth?.user?.Pincode;
      if (!coordinates) {
        coordinates = await getUserLocation();
      }

      if (coordinates && auth) {
        setWorkerCoordinates(coordinates);
      }

      fetchWorkers(coordinates, pincode);
    };

    initializeData();
  }, [currentPage, ServiceType]);

  // Fetch workers only after coordinates are available
  const fetchWorkers = async (coordinates, pincode) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/users/ListWorkers/${currentPage}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Pincode: pincode,
            ServiceType: ServiceType,
            Coordinates: {
              coordinates: [coordinates.latitude, coordinates.longitude],
            },
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setWorkers(data.Workers);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error("No workers found");
        setWorkers([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleServiceTypeChange = (value) => {
    setServiceType(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <p className="text-center font-bold text-4xl text-gray-800">
        Hire Service Providers Directly
      </p>

      <div className="flex justify-between mt-6">
        {/* Filters */}
        <div className="w-1/4 bg-white shadow-md rounded-xl p-4 h-[400px]">
          <p className="font-semibold text-lg text-center">Filters</p>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-gray-700">Service Type</p>
            <Select
              required
              onValueChange={handleServiceTypeChange}
              value={ServiceType}
            >
              <SelectTrigger className="w-full border-gray-300 rounded-lg shadow-sm">
                <SelectValue placeholder="Select a Service" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Electrician",
                  "Carpenter",
                  "Plumber",
                  "Painter",
                  "Gardener",
                  "Mechanic",
                  "Locksmith",
                  "Handyman",
                  "Welder",
                  "Pest Control",
                  "Roofer",
                  "Tiler",
                  "Appliance Repair",
                  "Flooring Specialist",
                ].map((service) => (
                  <SelectItem key={service} value={service.toLowerCase()}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="w-full  rounded-lg transition"
              onClick={() => setServiceType("")}
            >
              Clear Service Filter
            </Button>
          </div>
        </div>

        {/* Service Providers */}
        <div className="w-2/3 flex flex-col items-center">
          <p className="text-lg text-gray-600 mb-4">
            Service providers according to your preferences
          </p>

          {loading ? (
            <p className="text-gray-500 text-lg">Loading...</p>
          ) : workers?.length > 0 ? (
            <div className="w-full flex flex-col gap-6 items-center h-[500px] overflow-auto">
              {workers.map((worker) => (
                <div
                  key={worker._id}
                  className="flex flex-col gap-4 border border-gray-300 shadow-lg p-6 rounded-xl cursor-pointer bg-white w-full "
                >
                  {/* Header */}
                  <div className="flex gap-4 items-center">
                    <Avatar
                      alt={worker.Name}
                      src={`${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/workers/GetWorkerImage/${worker._id}`}
                      sx={{ width: 90, height: 90 }}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-semibold">{worker.Name}</p>
                        {worker.Verified?.verified === "Verified" && (
                          <Chip
                            icon={<MdVerifiedUser />}
                            label="Verified"
                            size="small"
                            color="success"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Rating
                          name="read-only"
                          value={worker.OverallRaitngs || 0}
                          readOnly
                          max={1}
                        />
                        <span className="text-sm">
                          {worker.OverallRaitngs}{" "}
                          <span className="text-gray-400">
                            ({worker.Reviews?.length || 0} reviews)
                          </span>
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">
                        <Chip label={worker.ServiceType} size="small" />
                      </p>
                      {worker.city && (
                        <p className="flex items-center text-gray-500 gap-1">
                          <MdOutlineLocationOn className="text-xl text-gray-600" />
                          {worker.city}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="flex gap-2 flex-wrap">
                    {worker?.SubSerives?.map((sub, index) => (
                      <Chip key={index} label={sub} variant="outlined" />
                    ))}
                  </div>
                  <hr className="border-gray-300" />

                  {/* Other Details */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">
                      <Tag className="text-sm">Completed Requests:</Tag>{" "}
                      <span className="font-semibold">
                        {worker.CompletedRequest || 0}
                      </span>
                    </span>
                    <div className="flex gap-3">
                      <Link href={`/worker/worker_profile/${worker._id}`}>
                        <Button className=" text-white px-4 py-2 rounded-lg shadow-md  transition">
                          View Profile
                        </Button>
                      </Link>
                      <Button className="flex items-center gap-2  text-white px-4 py-2 rounded-lg shadow-md  transition">
                        <FaHandshake />
                        Hire
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}

              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
              />
            </div>
          ) : (
            <p className="text-gray-500 text-lg">No workers found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hire;
