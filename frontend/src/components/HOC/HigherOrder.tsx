import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HigherOrder: React.FC<{ children: any }> = ({ children }) => {
  const navigate = useNavigate();
  const [authenticate, setAuthenticate] = useState<boolean>(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login"); // Redirect to login if no token is found
    } else {
      setAuthenticate(true);
    }
  }, [navigate]);

  if (!authenticate) {
    return null;
  }

  return <>{children}</>;
};

export default HigherOrder;
