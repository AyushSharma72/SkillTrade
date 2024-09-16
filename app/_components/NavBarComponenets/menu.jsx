import React, { useState } from "react";
import { Button, Dropdown, Space, Drawer } from "antd"; // Ant Design Button
import Link from "next/link";
import { Button as CustomButton } from "@/components/ui/button"; // Custom Button renamed to CustomButton for clarity

const NavbarMenu = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const items = [
    {
      key: "1",
      label: <p onClick={showDrawer}>Dashboard</p>,
    },
    {
      key: "2",
      label: <CustomButton className="w-full">Logout</CustomButton>,
    },
  ];

  return (
    <>
      <Space direction="vertical">
        <Space wrap>
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomLeft"
          >
            <Button className="font-bold">My Account</Button>
          </Dropdown>
        </Space>
      </Space>
      <Drawer title="Dashboard" closable={true} onClose={onClose} open={open}>
        <Link href="/user/view_request">
          <CustomButton className="w-full" onClick={onClose}>
            View Requests
          </CustomButton>
        </Link>
      </Drawer>
    </>
  );
};

export default NavbarMenu;
