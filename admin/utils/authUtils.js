const isAdminAuthenticated = () => {
  const token =
    localStorage.getItem("token") && localStorage.getItem("role") === "admin"
      ? localStorage.getItem("token")
      : null;
  return token;
};

export default isAdminAuthenticated;
