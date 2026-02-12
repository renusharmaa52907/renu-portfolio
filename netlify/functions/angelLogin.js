const axios = require("axios");
const { authenticator } = require("otplib");

exports.handler = async function (event, context) {
  try {
    // Generate dynamic TOTP
    const totp = authenticator.generate(process.env.ANGEL_TOTP);

    const response = await axios.post(
      "https://apiconnect.angelone.in/rest/auth/angelbroking/user/v1/loginByPassword",
      {
        clientcode: process.env.ANGEL_CLIENT_ID,
        password: process.env.ANGEL_PASSWORD,
        totp: totp,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-UserType": "USER",
          "X-SourceID": "WEB",
          "X-ClientLocalIP": "127.0.0.1",
          "X-ClientPublicIP": "127.0.0.1",
          "X-MACAddress": "00:00:00:00:00:00",
          "X-PrivateKey": process.env.ANGEL_API_KEY,
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        error.response ? error.response.data : error.message
      ),
    };
  }
};

 
