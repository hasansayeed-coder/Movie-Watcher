// In tokenBlacklist.js — auto-clean expired tokens
import jsonwebtoken from "jsonwebtoken";

const blacklist = new Set();

const add = (token) => {
  blacklist.add(token);

  // Auto-remove when token would have expired anyway
  const decoded = jsonwebtoken.decode(token);
  if (decoded?.exp) {
    const msUntilExpiry = (decoded.exp * 1000) - Date.now();
    setTimeout(() => blacklist.delete(token), msUntilExpiry);
  }
};

const has = (token) => blacklist.has(token);

export default { add, has };