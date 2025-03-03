import * as Yup from "yup";

const schema = {
  login: Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Please enter your email"),

    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
      )
      .required("Please enter your password"),
  }),
  register: Yup.object({
    userName: Yup.string()
      .max(25, "Username must be at most 25 characters")
      .min(4, "Username must be at least 4 characters")
      .required("Please enter your username"),

    email: Yup.string()
      .email("Invalid email format")
      .required("Please enter your email"),

    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
      )
      .required("Please enter your password"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm password is required"),
  }),
};

export default schema;
