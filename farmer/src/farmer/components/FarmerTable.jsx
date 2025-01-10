import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const FarmerTable = ({ data, setSelectedProduct, setModify, handleOpen }) => {
  const handleViewProduct = (product) => {
    setModify(true);
    setSelectedProduct(product);
    handleOpen();
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
              <TableCell align="right">Quantity Available (kg)</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((product, i) => (
              <TableRow
                key={i}
                hover
                style={{ cursor: "pointer" }}
                onClick={() => handleViewProduct(product)}
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
                <TableCell align="right">
                  {product.quantityAvailableInKg}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default FarmerTable;
