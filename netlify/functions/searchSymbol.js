const axios = require("axios");

exports.handler = async function (event, context) {
  try {
    const symbol = event.queryStringParameters.symbol;

    if (!symbol) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Symbol is required" }),
      };
    }

    // 🔐 STEP 1: LOGIN FIRST (Get fresh JWT)
    const loginResponse = await axios.post(
      "https://apiconnect.angelone.in/rest/auth/angelbroking/user/v1/loginByPassword",
      {
        clientcode: process.env.ANGEL_CLIENT_ID,
        password: process.env.ANGEL_PASSWORD,
        totp: process.env.ANGEL_TOTP,
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

    const jwtToken = loginResponse.data.data.jwtToken;

    // 🔍 STEP 2: SEARCH SYMBOL
    const searchResponse = await axios.post(
      "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/searchScrip",
      {
        exchange: "NFO",
        searchscrip: symbol,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-PrivateKey": process.env.ANGEL_API_KEY,
          Authorization: `Bearer ${jwtToken}`,
          "X-SourceID": "WEB",
          "X-UserType": "USER",
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(searchResponse.data),
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
