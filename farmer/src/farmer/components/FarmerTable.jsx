import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchAllProducts, removeProduct } from "../auth/productActions";
import { useSnackbar } from "notistack";

const FarmerTable = ({ data, onEdit, farmerId }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  // Handle delete click
  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setOpenDeleteDialog(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await dispatch(removeProduct(productToDelete)).unwrap();
      dispatch(fetchAllProducts({ farmerId }));
      enqueueSnackbar("Product deleted successfully", { variant: "success" });
    } catch (error) {
      dispatch(fetchAllProducts({ farmerId }));
      enqueueSnackbar(error?.message || "Failed to delete product", {
        variant: "error",
      });
    } finally {
      setOpenDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setProductToDelete(null);
  };

  return (
    <>
      <TableContainer component={Paper} className="mt-3">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Price per KG</TableCell>
              <TableCell align="right">Retailer Price per KG</TableCell>
              <TableCell align="right">Quantity Available (kg)</TableCell>
              <TableCell align="right">Remove Product</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((product, i) => (
              <TableRow
                key={i}
                hover
                style={{ cursor: "pointer" }}
                onClick={() => onEdit(product)} // Use the onEdit prop
              >
                <TableCell component="th" scope="row">
                  {i + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {product.name}
                </TableCell>
                <TableCell align="right">{product.description}</TableCell>
                <TableCell align="right">{product.category}</TableCell>
                <TableCell align="right">{product.pricePerKg}</TableCell>
                <TableCell align="right">{product.retailerPrice}</TableCell>
                <TableCell align="right">
                  {product.quantityAvailableInKg}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="text"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleDeleteClick(product._id);
                    }}
                  >
                    <DeleteIcon className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
            Are you sure you want to delete this product? This action cannot be
            undone.
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
    </>
  );
};

export default FarmerTable;
