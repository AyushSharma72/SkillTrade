"use client";
import dynamic from "next/dynamic";

const Tabs = dynamic(() => import("antd").then((mod) => mod.Tabs), {
  ssr: false,
});
const Userinfo = dynamic(() => import("./_Userinfo/Userinfo"), { ssr: false });
const UserPassword = dynamic(() => import("./_Userpassword/Userpassword"), {
  ssr: false,
});
const UserPrivateRoutes = dynamic(
  () => import("@/app/_components/privateroutes/UserPrivateRoutes"),
  { ssr: false }
);
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
    <div className="w-full">
      <p className="text-3xl font-bold text-center sm:mt-5 mt-20">
        {" "}
        User Profile Management
      </p>
      <Tabs items={items} className="mt-3" />
    </div>
  );
};

export default UserPrivateRoutes(page);
