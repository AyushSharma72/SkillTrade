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



  function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    return distance.toFixed(2);
  }


export { services, steps, style, StyledTableCell, StyledTableRow ,labels , calculateDistance };
