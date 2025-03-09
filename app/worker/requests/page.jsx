"use client";
import React from "react";
import { Tabs } from "antd";
import { FaCheck } from "react-icons/fa";
import { MdAssignmentInd, MdIncompleteCircle } from "react-icons/md";
import dynamic from "next/dynamic";

const AssignedRequest = dynamic(() => import("./_Components/AssignedRequest"), {
  ssr: false,
});
const AcceptedRequest = dynamic(() => import("./_Components/AcceptedRequest"), {
  ssr: false,
});
const CompletedRequest = dynamic(
  () => import("./_Components/CompletedRequest"),
  { ssr: false }
);

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
    {
      key: "3",
      label: "Completed Request",
      children: <CompletedRequest />,
      icon: <MdIncompleteCircle />,
    },
  ];
  return (
    <div className="p-2">
      <Tabs defaultActiveKey="1" items={items} className="sm:mt-0 mt-20" />
    </div>
  );
};

export default WorkerRequests;
