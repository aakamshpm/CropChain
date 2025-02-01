const RetailerCounter = ({
  productId,
  count,
  cartFarmerId,
  quantityAvailable,
}) => {
  const handleChange = (e) => {};
  return (
    <div>
      <input type="number" defaultValue="100" onChange={handleChange} />
    </div>
  );
};

export default RetailerCounter;
