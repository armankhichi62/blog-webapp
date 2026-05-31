const jwt = require("jsonwebtoken");

exports.protect = async(req,res,next)=>{

try{

let token;

if (
  req.headers.authorization &&
  req.headers.authorization.toLowerCase().startsWith("bearer")
) {
  token = req.headers.authorization.split(" ")[1];
}

if(!token){
return res.status(401).json({
message:"Not authorized"
});

}

const decoded=jwt.verify(
token,
process.env.JWT_SECRET
);

req.user=decoded;
next();

}
catch(error){

res.status(401).json({
message:"Invalid Token"
});

}

};

// Role Middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access Denied"
      });
    }

    next();
  };
};