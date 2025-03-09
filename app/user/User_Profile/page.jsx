"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Tabs } from "antd";
import Userinfo from "./_Userinfo/Userinfo";
import UserPassword from "./_Userpassword/Userpassword";
import { IoMdInformationCircle } from "react-icons/io";
import { FaLock } from "react-icons/fa6";

// Dynamically import UserPrivateRoutes to prevent SSR issues
const UserPrivateRoutes = dynamic(
  () => import("@/app/_components/privateroutes/UserPrivateRoutes"),
  { ssr: false }
);

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
      <p className="text-3xl font-bold  text-center sm:mt-5 mt-20">
        {" "}
        User Profile Management
      </p>
      <Tabs items={items} className="mt-3" />
    </div>
  );
};

export default UserPrivateRoutes(page);
