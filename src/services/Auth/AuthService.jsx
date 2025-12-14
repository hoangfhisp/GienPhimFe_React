import * as request from "../../untils/Request.jsx";

export const refreshToken = async (refreshToken) => {
  try {
    const res = await request.post("/auth/refreshToken", {
      refreshToken
    });

    return {
      status: true,
      data: res.data
    };
  } catch (e) {
    return {
      status: false,
      msg: "Refresh token hết hạn"
    };
  }
};