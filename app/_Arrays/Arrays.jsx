import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";

const services = [
  { value: "electrician", label: "Electrician" },
  { value: "carpenter", label: "Carpenter" },
  { value: "plumber", label: "Plumber" },
  { value: "painter", label: "Painter" },
  { value: "gardener", label: "Gardener" },
  { value: "mechanic", label: "Mechanic" },
  { value: "locksmith", label: "Locksmith" },
  { value: "handyman", label: "Handyman" },
  { value: "welder", label: "Welder" },
  { value: "pest_control", label: "Pest Control" },
  { value: "roofer", label: "Roofer" },
  { value: "tiler", label: "Tiler" },
  { value: "appliance_repair", label: "Appliance Repair" },
  { value: "flooring_specialist", label: "Flooring Specialist" },
];

//form steps

const steps = [
  "Select service and description",
  "Upload photo (optional)",
  "Select location and time",
];

// mui style for modal

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const labels = {
    1: "Very Poor 😭",

    2: "Poor 🥲",

    3: "Ok 🥱",

    4: "Good👍",

    5: "Excellent 😍",
  };

export { services, steps, style, StyledTableCell, StyledTableRow ,labels };
