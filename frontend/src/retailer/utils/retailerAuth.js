export const isRetailerAuthenticated = () => {
  const token =
    localStorage.getItem("token") && localStorage.getItem("role") === "retailer"
      ? localStorage.getItem("token")
      : null;
  return token;
};
