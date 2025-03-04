import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

const HigherOrder: React.FC<{ children: any }> = ({ children }) => {
  const navigate = useNavigate();
  const { token } = useAppSelector((store) => store.user);
  const [authenticate, setAuthenticate] = useState<boolean>(false);

  useEffect(() => {
    if (!localStorage.getItem("token") && !token) {
      navigate("/login"); // Redirect to login if no token is found
    } else {
      setAuthenticate(true);
    }
  }, [token]);

  if (!authenticate) {
    return null;
  }

  return <>{children}</>;
};

export default HigherOrder;
