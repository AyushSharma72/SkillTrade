"use client"
import React from "react";
import { Tabs } from "antd";
import { CgDetailsMore } from "react-icons/cg";
import { TbTimeline } from "react-icons/tb";
import { RiCalendarScheduleFill } from "react-icons/ri";
import RequestDetails from "../_Components/RequestDetails";
import TimeLine from "../_Components/TimeLine";
import Reschedule from "../_Components/Reschedule";
import UserPrivateRoutes from "../../../_components/privateroutes/UserPrivateRoutes";

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
      label: "Timeline",
      children: <TimeLine />,
      icon: <TbTimeline />,
    },
    {
      key: "3",
      label: "Reschedule",
      children: <Reschedule />,
      icon: <RiCalendarScheduleFill />,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} className="sm:mt-0 mt-20" />
    </div>
  );
};

export default UserPrivateRoutes(page);
