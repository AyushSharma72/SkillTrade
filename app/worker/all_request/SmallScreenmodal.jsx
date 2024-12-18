import React from "react";
import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Modal from "@mui/material/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const SmallScreenmodal = ({
  open,
  handleClose,
  handleServiceTypeChange,
  ServiceType,
  handleChange,
  Disabled,
  checkedValues,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div className="w-full flex flex-col gap-2">
          <p className="font-semibold">Service type</p>
          <Select
            required
            onValueChange={handleServiceTypeChange}
            value={ServiceType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Service Type" />
            </SelectTrigger>
            <SelectContent portal={true} className="z-[1500]">
              <SelectItem value="electrician">Electrician</SelectItem>
              <SelectItem value="carpenter">Carpenter</SelectItem>
              <SelectItem value="plumber">Plumber</SelectItem>
              <SelectItem value="painter">Painter</SelectItem>
              <SelectItem value="gardener">Gardener</SelectItem>
              <SelectItem value="mechanic">Mechanic</SelectItem>
              <SelectItem value="locksmith">Locksmith</SelectItem>
              <SelectItem value="handyman">Handyman</SelectItem>
              <SelectItem value="welder">Welder</SelectItem>
              <SelectItem value="pest_control">Pest Control</SelectItem>
              <SelectItem value="roofer">Roofer</SelectItem>
              <SelectItem value="tiler">Tiler</SelectItem>
              <SelectItem value="appliance_repair">Appliance Repair</SelectItem>
              <SelectItem value="flooring_specialist">
                Flooring Specialist
              </SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleServiceTypeChange("")}>
            Clear service filter
          </Button>

          <div className="mt-3">
            <p className="font-semibold">Location</p>
            <FormControlLabel
              name="nearBy"
              control={<Checkbox />}
              checked={checkedValues.nearBy}
              onChange={handleChange}
              label="Near By"
            />
            <FormControlLabel
              name="yourCity"
              control={<Checkbox disabled={Disabled} />}
              checked={checkedValues.yourCity}
              onChange={handleChange}
              label="Your City"
            />
            {Disabled && (
              <p className="text-red-600">
                Update your city to enable this filter
              </p>
            )}
          </div>

          <Button onClick={handleClose}>Close</Button>
        </div>
      </Box>
    </Modal>
  );
};

export default SmallScreenmodal;
