import privateClient from "../client/private.client.js";
import publicClient from "../client/public.client.js";

const userEndpoints = {
  signin: "user/signin",
  signup: "user/signup",
  signout: "user/signout",                        // ← add
  getInfo: "user/info",
  passwordUpdate: "user/update-password",
  verifyEmail: "user/verify-email",               // ← add
  resendVerification: "user/resend-verification", // ← add
  forgotPassword: "user/forgot-password",         // ← add
  resetPassword: "user/reset-password"            // ← add
};

const userApi = {
  signin: async ({ username, password }) => {
    try {
      console.log("send request");
      const response = await publicClient.post(
        userEndpoints.signin,
        { username, password }
      );

      return { response };
    } catch (err) { 
      console.log("err"); 
      return { err }; }
  },
  signup: async ({ username, password, confirmPassword, displayName }) => {
    try {
      const response = await publicClient.post(
        userEndpoints.signup,
        { username, password, confirmPassword, displayName }
      );

      return { response };
    } catch (err) { return { err }; }
  },
  getInfo: async () => {
    try {
      const response = await privateClient.get(userEndpoints.getInfo);

      return { response };
    } catch (err) { return { err }; }
  },
  passwordUpdate: async ({ password, newPassword, confirmNewPassword }) => {
    try {
      const response = await privateClient.put(
        userEndpoints.passwordUpdate,
        { password, newPassword, confirmNewPassword }
      );

      return { response };
    } catch (err) { return { err }; }
  } , 
  signout: async () => {
  try {
    const response = await privateClient.post(userEndpoints.signout);
    return { response };
  } catch (err) { return { err }; }
},

verifyEmail: async ({ token }) => {
  try {
    const response = await publicClient.get(
      `${userEndpoints.verifyEmail}?token=${token}`
    );
    return { response };
  } catch (err) { return { err }; }
},

resendVerification: async () => {
  try {
    const response = await privateClient.post(userEndpoints.resendVerification);
    return { response };
  } catch (err) { return { err }; }
},

forgotPassword: async ({ username }) => {
  try {
    const response = await publicClient.post(
      userEndpoints.forgotPassword,
      { username }
    );
    return { response };
  } catch (err) { return { err }; }
},
resetPassword: async ({ token, newPassword, confirmNewPassword }) => {
  try {
    const response = await publicClient.post(
      userEndpoints.resetPassword,
      { token, newPassword, confirmNewPassword }
    );
    return { response };
  } catch (err) { return { err }; }
}

};

export default userApi;