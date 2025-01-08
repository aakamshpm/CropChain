import { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button } from "@mui/material";
import { useGetProductsByFarmerQuery } from "../auth/authService";
import FarmerTable from "../components/FarmerTable";
import ModifyProduct from "../components/ModifyProduct";

const Products = () => {
  const { data, refetch } = useGetProductsByFarmerQuery();

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modify, setModify] = useState(false);

  // Handlers for opening and closing the modal
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleAddProduct = () => {
    setModify(false);
    setSelectedProduct(null);

    handleOpen();
  };

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
        <Button className="mr-2" variant="text" onClick={handleAddProduct}>
          <AddCircleIcon />
        </Button>
      </div>
      <ModifyProduct
        handleClose={handleClose}
        product={selectedProduct}
        open={open}
        modify={modify}
        setModify={setModify}
      />

      <FarmerTable
        data={data.data}
        setSelectedProduct={setSelectedProduct}
        setModify={setModify}
        handleOpen={handleOpen}
      />
    </div>
  );
};

export default Products;
