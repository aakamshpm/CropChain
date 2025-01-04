import { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import { useGetProductsByFarmerQuery } from "../auth/authService";
import FarmerTable from "../components/FarmerTable";
import AddProduct from "../components/AddProduct";

const Products = () => {
  const { data, refetch } = useGetProductsByFarmerQuery();

  const [open, setOpen] = useState(false);

  // Handlers for opening and closing the modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    refetch();
  }, [data]);

  if (!data) {
    return <p>Loading ...</p>;
  }

  return (
    <div className="flex flex-col p-4 w-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button className="mr-2" variant="text" onClick={handleOpen}>
          <AddCircleIcon />
        </Button>
      </div>
      <AddProduct handleClose={handleClose} open={open} />
      <FarmerTable data={data.data} />
    </div>
  );
};

export default Products;
