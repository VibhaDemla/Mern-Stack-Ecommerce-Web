const ErrorHandler = require("../utils/errorHandler");

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Wrong Mongodb Id error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    } 

    //Mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Enetered`
        err = new ErrorHandler(message,400);
    }

    //Wrong JWTToken error
    if(err.name === "JsonWebTokenError"){
        const message = `Json web token is invalid, please try again`;
        err = new ErrorHandler(message,400);
    }

    //JWT EXPIRE error 
    if(err.name === "TokenExpirederError"){
        const message = `Json web token is expired, please try again`;
        err = new ErrorHandler(message,400);
    }


    res.status(err.statusCode).json({
        success:false,
        message:err.message,


    })
}