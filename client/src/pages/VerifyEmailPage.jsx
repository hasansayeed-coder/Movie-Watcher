import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import userApi from "../api/modules/user.api.js";
import Container from "../components/common/Container.jsx";
import uiConfigs from "../configs/ui.configs.js";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        return;
      }

      const { response, err } = await userApi.verifyEmail({ token });

      if (response) {
        setStatus("success");
        toast.success("Email verified! Please sign in.");
        setTimeout(() => navigate("/"), 3000);
      }

      if (err) {
        setStatus("error");
        toast.error(err.message);
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header="Email Verification">
        <Stack alignItems="center" spacing={3} padding={4}>
          {status === "loading" && (
            <>
              <CircularProgress />
              <Typography>Verifying your email...</Typography>
            </>
          )}
          {status === "success" && (
            <Typography color="success.main" variant="h6">
              ✅ Email verified successfully! Redirecting...
            </Typography>
          )}
          {status === "error" && (
            <Typography color="error.main" variant="h6">
              ❌ Invalid or expired verification link.
            </Typography>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default VerifyEmailPage;