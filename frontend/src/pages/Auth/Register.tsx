import React, { useEffect } from "react";
import Form from "../../components/Form/Form";
import { RegisterData, STATUS } from "../../types";
import { useAppdispatch, useAppSelector } from "../../store/hooks";
import { registerUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { setStatus } from "../../store/userSlice";

const Register = () => {
  const dispatch = useAppdispatch();
  const { status } = useAppSelector((store) => store.user);
  const navigate = useNavigate();
  const handleRegister = (data: RegisterData) => {
    dispatch(registerUser(data));
  };
  useEffect(() => {
    if (status == STATUS.SUCCESS) {
      dispatch(setStatus(STATUS.LOADING));
      navigate("/login");
    }
  }, [status]);
  return <Form type="register" formSubmit={handleRegister} />;
};

export default Register;
