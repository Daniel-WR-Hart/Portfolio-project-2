require('dotenv').config();
const { apiKey } = process.env;

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ msg: apiKey })
  };
};


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
