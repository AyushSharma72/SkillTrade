import React from "react";
import { Tabs } from "antd";
import Userinfo from "./_Userinfo/Userinfo";
import UserPassword from "./_Userpassword/Userpassword";
import { IoMdInformationCircle } from "react-icons/io";
import { FaLock } from "react-icons/fa6";

const items = [
  {
    key: "1",
    label: "User Profile",
    children: <Userinfo />,
    icon: <IoMdInformationCircle />,
  },
  {
    key: "2",
    label: "Password",
    children: <UserPassword />,
    icon: <FaLock />,
  },
];

const page = () => {
  return (
    <div className="w-full ">
      <p className="text-3xl font-bold  text-center mt-5">
        {" "}
        User Profile Management
      </p>
      <Tabs items={items} className="mt-3" />
    </div>
  );
};

export default page;
