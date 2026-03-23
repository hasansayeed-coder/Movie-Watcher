import privateClient from "../client/private.client.js";

const avatarApi = {
  upload: async ({ formData }) => {
    try {
      const response = await privateClient.post(
        "user/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      return { response };
    } catch (err) { return { err }; }
  },
  remove: async () => {
    try {
      const response = await privateClient.delete("user/avatar");
      return { response };
    } catch (err) { return { err }; }
  }
};

export default avatarApi;