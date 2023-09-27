function responseHandler(code, message, data, res, customResponse) {
  switch (code) {
    case 200:
      res.status(200).send({ success: true, message: message, data: data });
      break;
    case 201:
      res.status(201).send({ success: true, message: message, data: data });
      break;
    default:
      res.status(200).send({ success: true, message: "", data: "" });
      break;
  }
}

function ErrorHandler(code, message, data, res) {
  switch (code) {
    case 200:
      res.status(200).send({ success: true, message: message, data: data });
      break;
    case 201:
      res.status(201).send({ success: true, message: message, data: data });
      break;
    default:
      res.status(200).send({ success: true, message: "", data: "" });
      break;
  }
}

module.exports = {
  successHandler,
  responseHandler,
  ErrorHandler,
};
