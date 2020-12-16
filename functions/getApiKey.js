// require('dotenv').config();
// const { apiKey } = process.env;

// exports.handler = async (event, context) => {
//   return {
//     statusCode: 200,
//     body: apiKey
//   };
// };


// exports.handler = () => {
//   return {
//     statusCode: 200,
//     body: "hello"
//   };
// };


exports.handler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ msg: "hello" })
  });
}
