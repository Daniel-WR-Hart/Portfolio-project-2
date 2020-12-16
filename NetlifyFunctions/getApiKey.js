// require('dotenv').config();
// const { apiKey } = process.env;

// exports.handler = async (event, context) => {
//   return {
//     statusCode: 200,
//     body: apiKey
//   };
// };


exports.handler = async () => {
  return {
    statusCode: 200,
    body: "hello"
  };
};
