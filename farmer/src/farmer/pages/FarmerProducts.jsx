import { useEffect, useState } from "react";
import { useGetProductsByFarmerQuery } from "../auth/authService";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { MdOutlineInventory2 } from "react-icons/md";
import FarmerTable from "../components/FarmerTable";
import ModifyProduct from "../components/ModifyProduct";
import { removeAllProductsFromFarmer } from "../auth/productActions";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

const Products = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openModifyDialog, setOpenModifyDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [preview, setPreview] = useState(null);

  const { id } = useSelector((state) => state.auth.data);

  // Single product for state handling in ModifyProducts
  const { product } = useSelector((state) => state.product);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // Fetch products data
  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useGetProductsByFarmerQuery(id);

  // Handle opening and closing the modify product dialog
  const handleModifyDialogOpen = (product = null) => {
    setSelectedProduct(product);
    setPreview(product ? product.image : null);
    setOpenModifyDialog(true);
  };

  const handleModifyDialogClose = () => {
    setOpenModifyDialog(false);
    setSelectedProduct(null);
    setPreview(null);
  };

  // Handle delete confirmation dialog
  const handleDeleteDialogOpen = () => setOpenDeleteDialog(true);
  const handleDeleteDialogClose = () => setOpenDeleteDialog(false);

  // Handle delete all products
  const handleDeleteAllProducts = async () => {
    try {
      await dispatch(removeAllProductsFromFarmer()).unwrap();
      enqueueSnackbar("All products deleted successfully", {
        variant: "success",
      });
      refetch();
    } catch (error) {
      enqueueSnackbar(error || "Failed to delete products", {
        variant: "error",
      });
    } finally {
      handleDeleteDialogClose();
    }
  };

  // Refetch products when the product state changes
  useEffect(() => {
    refetch();
  }, [product, refetch]);
  // Show loading state
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Show error state
  if (isError) {
    return <p>Error loading products. Please try again later.</p>;
  }

  return (
    <div className="flex flex-col p-4 w-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex">
          <Button
            className="mr-2"
            variant="text"
            onClick={() => handleModifyDialogOpen()}
          >
            <AddCircleIcon />
          </Button>
          <Button variant="text" onClick={handleDeleteDialogOpen}>
            <DeleteIcon className="text-red-500" />
          </Button>
        </div>
      </div>

      {/* Modify Product Dialog */}
      <ModifyProduct
        open={openModifyDialog}
        handleClose={handleModifyDialogClose}
        product={selectedProduct}
        modify={!!selectedProduct} // Set modify mode if a product is selected
        preview={preview}
        setPreview={setPreview}
        refetch={refetch}
      />

      {productsData?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[600px] p-6">
          <MdOutlineInventory2 className="text-6xl text-gray-500 mb-4" />
          <p className="text-lg text-gray-700">No Products Found</p>
        </div>
      ) : (
        <FarmerTable
          data={productsData?.data || []}
          onEdit={handleModifyDialogOpen}
          refetch={refetch}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete all products? <br />
            <strong>This action cannot be undone.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAllProducts} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Products;
