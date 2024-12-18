import React from "react";
import Modal from "@mui/material/Modal";

const ModalComponent = ({ handleClose, open, ModalType, rid }) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalType handleClose={handleClose} rid={rid} />
      </Modal>
    </div>
  );
};

export default ModalComponent;
