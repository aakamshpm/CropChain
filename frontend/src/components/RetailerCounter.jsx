import { TextField } from "@mui/material";

const RetailerCounter = ({ cartQuantity, setCartQuantity }) => {
  const onChangeHandler = (e) => {
    const { value } = e.target;
    setCartQuantity(parseFloat(value));
  };
  return (
    <div className="flex items-center">
      <TextField
        type="number"
        value={cartQuantity}
        onChange={onChangeHandler}
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
