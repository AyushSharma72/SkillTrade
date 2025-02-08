import React from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { MdVerifiedUser } from "react-icons/md";
import Rating from "@mui/material/Rating";
import { MdOutlineLocationOn } from "react-icons/md";
import { Tag } from "antd";
import { FaPhoneAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
const Hire = () => {
  return (
    <div>
      <p className="text-center w-full font-semibold text-3xl">
        Hire Service Providers Directly
      </p>

      <div className="flex justify-around mt-5">
        {/* filters  */}
        <div className="w-1/4">
          <p>Filters</p>
        </div>

        {/* service providers */}
        <div className="w-1/2 flex flex-col items-center">
          <p>Service providers according to your preferences</p>
          <div className="w-full flex flex-col gap-4 border p-4 rounded-lg">
            {/* header  */}
            <div className="flex gap-3">
              {/* image  */}
              <Avatar
                alt="Remy Sharp"
                src="/static/images/avatar/1.jpg"
                sx={{ width: 80, height: 80 }}
              />
              <div className="flex flex-col justify-center gap-1 ">
                <div className="flex items-center gap-1">
                  <p className="font-bold ">Ayush sharma</p>|
                  <Chip
                    icon={<MdVerifiedUser />}
                    label="Verified"
                    size="small"
                    color="success"
                  />
                  |{" "}
                  <span className="flex items-center gap-1 ml-2">
                    {" "}
                    <Rating name="read-only" value={2} readOnly max={1} /> 2
                    <p className="text-gray-500"> (40)</p>
                  </span>
                </div>
                <p className="flex items-center gap-1">
                  <Chip label="Electrician" size="small" />
                </p>
                <p className="flex items-center gap-1">
                  <MdOutlineLocationOn className="text-xl" />
                  indore
                </p>
              </div>
            </div>

            {/* services */}
            <div className="flex gap-2">
              <Chip label="Wiring" variant="outlined" />
              <Chip label="Switches replacement" variant="outlined" />
              <Chip label="Appliance repair" variant="outlined" />
            </div>
            <hr></hr>
            {/* other details */}
            <div className="flex justify-between">
              <span>
                <Tag>Completed Request</Tag>10
              </span>
             <div className="flex gap-2"><Button>View Profile</Button>
              <Button className="gap-2 flex items-center"><FaPhoneAlt />Contact</Button></div> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hire;
