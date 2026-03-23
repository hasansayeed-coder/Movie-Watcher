import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import userModel from "../models/user.model.js";
import tokenBlacklist from "../utils/tokenBlacklist.js";


const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];

      return jsonwebtoken.verify(
        token,
        process.env.TOKEN_SECRET
      );
    }

    return false;
  } catch {
    return false;
  }
};

const auth = async (req, res, next) => {
  try {
    const tokenDecoded = tokenDecode(req);
    if (!tokenDecoded) return responseHandler.unauthorize(res);

    const bearerHeader = req.headers["authorization"];
    const token = bearerHeader.split(" ")[1];

    if (tokenBlacklist.has(token)) return responseHandler.unauthorize(res);

    const user = await userModel.findById(tokenDecoded.data);
    if (!user) return responseHandler.unauthorize(res);

    req.user = user;
    next();
  } catch {
    responseHandler.error(res);
  }
};

export default { auth, tokenDecode };