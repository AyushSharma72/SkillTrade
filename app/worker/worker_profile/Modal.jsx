import React from "react";
import Modal from "@mui/material/Modal";

const ModalComponent = ({ handleClose, open, ModalType, GetWorkerData }) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalType handleClose={handleClose} GetWorkerData={GetWorkerData} />
      </Modal>
    </div>
  );
};

export default ModalComponent;
