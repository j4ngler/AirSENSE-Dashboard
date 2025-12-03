
const HttpStatus = require('http-status-codes');
 
exports.returnOK =  (res, data) => {
    return res.status(HttpStatus.OK).json({
        result:data,
      });
}  

exports.returnOKCustom =  (res, data) => {
    return res.status(HttpStatus.OK).json(data);
}  
exports.returnFalse =  (res, error) => {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error,
        data: { message: "acao Not exitting "},
    });
}

exports.returnNotFound =  (res, error) => {
    return res.status(HttpStatus.NOT_FOUND).json({
        error: error,
        data: { message: "NOT_FOUND "},
    });
}
exports.returnNotAuthen =  (res, error) => {
    return res.status(HttpStatus.UNAUTHORIZED).json({
        error: error,
        data: { message: "UNAUTHORIZED "},
    });
}


