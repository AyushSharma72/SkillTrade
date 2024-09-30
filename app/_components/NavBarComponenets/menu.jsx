import React, { useState } from "react";
import { Button, Drawer } from "antd";
import Link from "next/link";
import { Button as CustomButton } from "@/components/ui/button";

const NavbarMenu = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        className="font-bold"
        closable={true}
        onClose={onClose}
        open={open}
        onClick={showDrawer}
      >
        My Account
      </Button>

      <Drawer title="Dashboard" closable={true} onClose={onClose} open={open}>
        <Link href="/user/view_request">
          <CustomButton className="w-full" onClick={onClose}>
            View Requests
          </CustomButton>
        </Link>
        <Link href="/user/User_Profile">
          <CustomButton className="w-full" onClick={onClose}>
            Profile
          </CustomButton>
        </Link>
      </Drawer>
    </>
  );
};

export default NavbarMenu;
