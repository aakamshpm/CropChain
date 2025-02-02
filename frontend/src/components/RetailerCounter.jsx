import { TextField } from "@mui/material";
import { useSnackbar } from "notistack";

const RetailerCounter = ({ cartQuantity, setCartQuantity }) => {
  return (
    <div className="flex items-center">
      <TextField
        type="number"
        value={cartQuantity}
        onChange={(e) => setCartQuantity(e.target.value)}
        slotProps={{
          htmlInput: {
            min: 100,
            step: 1,
          },
        }}
        sx={{
          width: "100px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
      />
      <span className="ml-2 text-gray-600">KG</span>
    </div>
  );
};

export default RetailerCounter;
