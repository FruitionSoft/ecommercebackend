function errorHandler(err, req, res, next) {
    if(err.name === "UnauthorizedError") {
        res.status(401).send({success: false, message: 'User is not authorized'})
    }
    if(err.name === "ValidationError") {
        res.status(401).send({success: false, message: err})
    }
    //else {
    //     res.status(500).send({success: false, message: err})
    // }
} 

module.exports = {
    errorHandler
}