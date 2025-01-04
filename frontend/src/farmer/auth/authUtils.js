export const isAuthenticated = () => {
  const token =
    localStorage.getItem("token") && localStorage.getItem("role") === "farmer"
      ? localStorage.getItem("token")
      : null;
  return token;
};
