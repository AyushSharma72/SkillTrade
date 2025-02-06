"use client";
import dynamic from "next/dynamic";

const Tabs = dynamic(() => import("antd").then((mod) => mod.Tabs), {
  ssr: false,
});

const FaCheck = dynamic(
  () => import("react-icons/fa").then((mod) => mod.FaCheck),
  { ssr: false }
);
const MdAssignmentInd = dynamic(
  () => import("react-icons/md").then((mod) => mod.MdAssignmentInd),
  { ssr: false }
);
const MdIncompleteCircle = dynamic(
  () => import("react-icons/md").then((mod) => mod.MdIncompleteCircle),
  { ssr: false }
);

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
