import React from "react";
import Box from "@mui/material/Box";
import { toast, Toaster } from "react-hot-toast";

const EditProfileModal = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: 3,
  };
  return (
    <Box
      sx={style}
      className="w-[300px] sm:w-[400px] flex flex-col gap-3 rounded-md"
    >
      <Toaster />
      <p className="text-xl font-semibold text-center">Edit your profile</p>

      <hr />
    </Box>
  );
};

export default EditProfileModal;
