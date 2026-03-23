import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userApi from "../api/modules/user.api.js";
import Container from "../components/common/Container.jsx";
import uiConfigs from "../configs/ui.configs.js";

const ResetPasswordPage = () => {
  const [onRequest, setOnRequest] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const form = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: ""
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(8, "minimum 8 characters")
        .required("new password is required"),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "passwords do not match")
        .required("please confirm your password")
    }),
    onSubmit: async (values) => {
      if (!token) return toast.error("Invalid reset link");
      if (onRequest) return;
      setOnRequest(true);

      const { response, err } = await userApi.resetPassword({
        token,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword
      });

      setOnRequest(false);

      if (err) toast.error(err.message);
      if (response) {
        toast.success("Password reset! Please sign in.");
        navigate("/");
      }
    }
  });

  if (!token) return (
    <>
      <Toolbar />
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Typography color="error">Invalid or missing reset token.</Typography>
      </Box>
    </>
  );

  return (
    <>
      <Toolbar />
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Container header="Reset Password">
          <Box component="form" maxWidth="400px" onSubmit={form.handleSubmit}>
            <Stack spacing={2}>
              <TextField
                type="password"
                placeholder="new password"
                name="newPassword"
                fullWidth
                value={form.values.newPassword}
                onChange={form.handleChange}
                color="success"
                error={form.touched.newPassword && form.errors.newPassword !== undefined}
                helperText={form.touched.newPassword && form.errors.newPassword}
              />
              <TextField
                type="password"
                placeholder="confirm new password"
                name="confirmNewPassword"
                fullWidth
                value={form.values.confirmNewPassword}
                onChange={form.handleChange}
                color="success"
                error={form.touched.confirmNewPassword && form.errors.confirmNewPassword !== undefined}
                helperText={form.touched.confirmNewPassword && form.errors.confirmNewPassword}
              />
              <LoadingButton
                type="submit"
                variant="contained"
                fullWidth
                loading={onRequest}
              >
                Reset Password
              </LoadingButton>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ResetPasswordPage;