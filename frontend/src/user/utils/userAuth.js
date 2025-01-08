export const isUserAuthenticated = () => {
  const token =
    localStorage.getItem("token") &&
    localStorage.getItem("role") === ("retailer" || "consumer")
      ? localStorage.getItem("token")
      : null;
  return token;
};
