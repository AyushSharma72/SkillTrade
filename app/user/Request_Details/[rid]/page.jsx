"use client";
import React from "react";
import { Tabs } from "antd";
import { CgDetailsMore } from "react-icons/cg";
import { TbTimeline } from "react-icons/tb";
import { RiCalendarScheduleFill } from "react-icons/ri";
import RequestDetails from "../_Components/RequestDetails";
import TimeLine from "../_Components/TimeLine";
import Reschedule from "../_Components/Reschedule";
import UserPrivateRoutes from "../../../_components/privateroutes/UserPrivateRoutes";
import AcceptedBy from "../_Components/AcceptedBy";
import { FaCircleCheck } from "react-icons/fa6";
const page = () => {
  const items = [
    {
      key: "1",
      label: "Request Details",
      children: <RequestDetails />,
      icon: <CgDetailsMore />,
    },
    {
      key: "2",
      label: "Reschedule",
      children: <Reschedule />,
      icon: <RiCalendarScheduleFill />,
    },
    {
      key: "3",
      label: "Accepted By",
      children: <AcceptedBy />,
      icon: <FaCircleCheck />,
    },
    {
      key: "4",
      label: "Timeline",
      children: <TimeLine />,
      icon: <TbTimeline />,
    },
  ];

  return (
    <div className="p-2">
      <Tabs defaultActiveKey="1" items={items} className="sm:mt-0 mt-20" />
    </div>
  );
};

export default UserPrivateRoutes(page);
