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
import FarmerTable from "../components/FarmerTable";
import ModifyProduct from "../components/ModifyProduct";
import { getFarmerIdFromToken } from "../../utils/utils";
import { removeAllProductsFromFarmer } from "../auth/productActions";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";

const Products = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const farmerId = getFarmerIdFromToken();

  const { data, isLoading, refetch } = useGetProductsByFarmerQuery(farmerId);

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modify, setModify] = useState(false);
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // Handlers for opening and closing the modal
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleAddProduct = () => {
    setPreview(null);
    setModify(false);
    setSelectedProduct(null);

    handleOpen();
  };

  const handleDeleteClick = (productId) => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    console.log("Deleting products");

    try {
      await dispatch(removeAllProductsFromFarmer()).unwrap();
    } catch (error) {
      enqueueSnackbar(error || "Error deleting products", { variant: "error" });
    } finally {
      refetch();
      setOpenDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    refetch();
  }, [open]);

  if (isLoading || !data) {
    return <p>Loading ...</p>;
  }

  return (
    <div className="flex flex-col p-4 w-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex">
          <Button className="mr-2" variant="text" onClick={handleAddProduct}>
            <AddCircleIcon />
          </Button>
          <Button
            variant="text"
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click event
              handleDeleteClick();
            }}
          >
            <DeleteIcon className="text-red-500" />
          </Button>
        </div>
      </div>
      <ModifyProduct
        handleClose={handleClose}
        product={selectedProduct}
        open={open}
        modify={modify}
        setModify={setModify}
        preview={preview}
        setPreview={setPreview}
        refetch={refetch}
      />

      <FarmerTable
        data={data.data}
        setSelectedProduct={setSelectedProduct}
        setModify={setModify}
        handleOpen={handleOpen}
        refetch={refetch}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
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
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Products;
