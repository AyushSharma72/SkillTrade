"use client";
import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { MdVerifiedUser, MdOutlineLocationOn } from "react-icons/md";
import Rating from "@mui/material/Rating";
import { Tag } from "antd";
import { FaPhoneAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const Hire = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const requestBody = {
    // ServiceType: "Electrician",
    // Coordinates: {
    //   coordinates: [75.8577, 22.7196],
    // },
    Pincode: 452010,
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC__BASE_URL}/api/v1/users/ListWorkers`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        const data = await response.json();

        if (data.success) {
          setWorkers(data.Workers);
        } else {
          console.error("No workers found");
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  
 return (
   <div className="max-w-7xl mx-auto p-6">
     <p className="text-center font-bold text-4xl text-gray-800">
       Hire Service Providers Directly
     </p>

     <div className="flex justify-between mt-6">
       {/* Filters */}
       <div className="w-1/4 bg-white shadow-md rounded-xl p-4 h-[400px]">
         <p className="font-semibold text-lg">Filters</p>
       </div>

       {/* Service Providers */}
       <div className="w-2/3 flex flex-col items-center">
         <p className="text-lg text-gray-600 mb-4">
           Service providers according to your preferences
         </p>

         {loading ? (
           <p className="text-gray-500 text-lg">Loading...</p>
         ) : workers?.length > 0 ? (
           <div className="w-full flex flex-col gap-6">
             {workers.map((worker) => (
               <div
                 key={worker._id}
                 className="flex flex-col gap-4 border border-gray-300 shadow-lg p-6 rounded-xl cursor-pointer bg-white"
               >
                 {/* Header */}
                 <div className="flex gap-4 items-center">
                   {/* Image */}
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
                     <Button className=" text-white px-4 py-2 rounded-lg shadow-md  transition">
                       View Profile
                     </Button>
                     <Button className="flex items-center gap-2  text-white px-4 py-2 rounded-lg shadow-md  transition">
                       <FaPhoneAlt />
                       <a
                         href={`tel:${worker.MobileNo.toString().substring(2)}`}
                       >
                         Contact
                       </a>
                     </Button>
                   </div>
                 </div>
               </div>
             ))}
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
