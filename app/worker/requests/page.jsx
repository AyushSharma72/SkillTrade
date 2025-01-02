"use client";
import React from "react";
import { Tabs } from "antd";
import AssignedRequest from "./_Components/AssignedRequest";
import AcceptedRequest from "./_Components/AcceptedRequest";
import { FaCheck } from "react-icons/fa";
import { MdAssignmentInd } from "react-icons/md";
const WorkerRequests = () => {
  const items = [
    {
      key: "1",
      label: "Accepted request",
      children: <AcceptedRequest />,
      icon: <FaCheck />,
    },
    {
      key: "2",
      label: "Assigned Request",
      children: <AssignedRequest />,
      icon: <MdAssignmentInd />,
    },
  ];
  return (
    <div className="p-2">
      <Tabs defaultActiveKey="1" items={items} className="sm:mt-0 mt-20" />
    </div>
  );
};

export default WorkerRequests;
