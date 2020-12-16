// require('dotenv').config();
// const { API_KEY } = process.env;

// exports.handler = async (event, context) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({ msg: API_KEY })
//   };
// };


// exports.handler = () => {
//   return {
//     statusCode: 200,
//     body: "hello"
//   };
// };


// exports.handler = function(event, context, callback) {
//   callback(null, {
//     statusCode: 200,
//     body: JSON.stringify({ msg: "2nd" })
//   });
// }


const { apiKey } = process.env;
exports.handler = function(event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ msg: apiKey })
  });
}


// const { API_KEY } = process.env;
// exports.handler = function(event, context, callback) {
//   callback(null, {
//     statusCode: 200,
//     body: JSON.stringify({ msg: API_KEY })
//   });
// }
