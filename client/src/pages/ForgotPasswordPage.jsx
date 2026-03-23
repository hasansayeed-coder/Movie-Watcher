import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField, Typography, Toolbar } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-toastify";
import userApi from "../api/modules/user.api.js";
import Container from "../components/common/Container.jsx";
import uiConfigs from "../configs/ui.configs.js";

const ForgotPasswordPage = () => {
  const [onRequest, setOnRequest] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useFormik({
    initialValues: { username: "" },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(8, "username minimum 8 characters")
        .required("username is required")
    }),
    onSubmit: async (values) => {
      if (onRequest) return;
      setOnRequest(true);
      const { response, err } = await userApi.forgotPassword({
        username: values.username
      });
      setOnRequest(false);
      if (err) toast.error(err.message);
      if (response) setSubmitted(true);
    }
  });

  return (
    <>
      <Toolbar />
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Container header="Forgot Password">
          <Box maxWidth="400px">
            {submitted ? (
              <Typography color="success.main">
                ✅ If that account exists, a reset link has been sent. Check your inbox.
              </Typography>
            ) : (
              <Box component="form" onSubmit={form.handleSubmit}>
                <Stack spacing={2}>
                  <Typography color="text.secondary">
                    Enter your username and we'll send you a password reset link.
                  </Typography>
                  <TextField
                    placeholder="username"
                    name="username"
                    fullWidth
                    value={form.values.username}
                    onChange={form.handleChange}
                    color="success"
                    error={form.touched.username && form.errors.username !== undefined}
                    helperText={form.touched.username && form.errors.username}
                  />
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    loading={onRequest}
                  >
                    Send Reset Link
                  </LoadingButton>
                </Stack>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ForgotPasswordPage;