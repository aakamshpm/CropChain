import { TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";

const RetailerCounter = ({
  productId,
  count,
  cartFarmerId,
  quantityAvailable,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [cartQuantity, setCartQuantity] = useState("100");

  const handleValidation = (e) => {
    const { value } = e.target;

    const numericValue = parseInt(value, 10);

    if (numericValue < 100) {
      enqueueSnackbar("Minimum quantity is 100 KG!", { variant: "error" });
      setCartQuantity("100");
    }
  };

  return (
    <div className="flex items-center">
      <TextField
        type="number"
        value={cartQuantity}
        onChange={(e) => setCartQuantity(e.target.value)}
        onBlur={handleValidation}
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
