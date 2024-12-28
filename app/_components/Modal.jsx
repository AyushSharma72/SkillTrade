import React from "react";
import Modal from "@mui/material/Modal";

const ModalComponent = ({ handleClose, open, ModalType, id }) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalType handleClose={handleClose} rid={id} />
      </Modal>
    </div>
  );
};

export default ModalComponent;
