export const isUserAuthenticated = () => {
  const token =
    localStorage.getItem("token") &&
    (localStorage.getItem("role") === "retailer" ||
      localStorage.getItem("role") === "consumer")
      ? localStorage.getItem("role")
      : null;
  return token;
};
