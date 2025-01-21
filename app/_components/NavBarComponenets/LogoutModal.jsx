import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {style} from "../../_Arrays/Arrays"

const LogoutModal = ({ modalState, onClose }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("userCoordinates");
    router.push("/login");
  };

  return (
    <Modal
      open={modalState}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="w-[300px] sm:w-[400px]">
        <Typography
          id="modal-modal-title"
          className="text-center text-red-600 font-bold"
          variant="h6"
        >
          Are you sure you want to logout?
        </Typography>
        <div className="flex flex-col mt-2">
          <Button
            className="w-full m-auto mb-1 flex"
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            Logout
          </Button>
          <Button className="w-full" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default LogoutModal;
