function responseHandler(res, code, data, customResponse, message, err) {
  switch (code) {
    case 200:
      res.status(200).send({
        success: true,
        message: message ? message : "Data updated successfully",
        data: data ? data : "",
      });
      break;
    case 201:
      res.status(201).send({
        success: true,
        message: message ? message : "Data Created successfully",
        data: data ? data : "",
      });
      break;
    case 202:
      res.status(202).send({
        success: true,
        message: message ? message : "Data Deleted successfully",
      });
      break;
    case 404:
      res.status(404).send({
        success: false,
        message: message ? message : "No date found!",
      });
      break;
    case 400:
      res.status(400).send({
        success: false,
        message: message ? message : "Bad Request",
      });
      break;
    case 403:
      res.status(403).send({
        success: false,
        message: message ? message : "Forbidden",
      });
      break;
    default:
      console.log(err)
      if (err.name === "ValidationError") {
        res.status(400).send({
          success: false,
          message: `Please ensure this fields in the request body (${Object.keys(
            err.errors
          )}),It is a required field`,
        });
      } else if (err.name === "CastError") {
        res.status(400).send({
          success: false,
          message: "Invalid data type",
          details:
            "One or more fields in the request contain data that cannot be cast to the expected data type. Check the data you are sending and ensure it matches the schema requirements.",
        });
      } else {
        res.status(500).send({
          success: false,
          message: message ? message : "Internal Server Error",
          err: err,
        });
      }
      break;
  }
}

module.exports = responseHandler;
