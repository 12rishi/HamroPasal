import React, { useEffect } from "react";
import Form from "../../components/Form/Form";
import { useAppdispatch, useAppSelector } from "../../store/hooks";
import { LoginData, STATUS } from "../../types";
import { loginUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { setStatus } from "../../store/userSlice";

const Login = () => {
  const dispatch = useAppdispatch();
  const { status, token } = useAppSelector((store) => store.user);
  const navigate = useNavigate();
  const handleLogin = (data: LoginData) => {
    dispatch(loginUser(data));
  };
  useEffect(() => {
    if (status == STATUS.SUCCESS) {
      dispatch(setStatus(STATUS.LOADING));
      localStorage.setItem("token", token as string);
      navigate("/");
    }
  }, [status]);
  return <Form type="login" formSubmit={handleLogin} />;
};

export default Login;
