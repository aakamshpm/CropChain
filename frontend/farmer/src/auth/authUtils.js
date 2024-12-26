export const isAuthenticated = () => {
  console.log("hy");
  const token = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : null;
  return token;
};
