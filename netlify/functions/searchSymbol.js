const axios = require("axios");

exports.handler = async function (event, context) {
  try {
    const symbol = event.queryStringParameters.symbol;

    const response = await axios.post(
      "https://apiconnect.angelone.in/rest/secure/angelbroking/order/v1/searchScrip",
      {
        exchange: "NFO",
        searchscrip: symbol
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-PrivateKey": process.env.ANGEL_API_KEY,
          Authorization: `Bearer ${process.env.ANGEL_JWT}`,
          "X-SourceID": "WEB",
          "X-UserType": "USER"
        }
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.response?.data || error.message)
    };
  }
};
