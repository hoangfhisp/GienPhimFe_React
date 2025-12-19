import * as request from "../../untils/Request.jsx";

export const refreshToken = async (refreshToken) => {
  try {
    const res = await request.post("/auth/refreshToken", {
      refreshToken
    });

    return res;
  } catch (e) {
    return {
      status: false,
      msg: "Refresh token hết hạn"
    };
  }
};