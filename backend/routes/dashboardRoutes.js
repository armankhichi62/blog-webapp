const express=require("express");

const router=express.Router();

const {
protect,
authorize
}=require("../middleware/authMiddleware");


router.get(
"/author",
protect,
authorize("author"),
(req,res)=>{

res.json({
message:
"Welcome Author Dashboard"
});

}
);

router.get(
"/admin",
protect,
authorize("admin"),
(req,res)=>{

res.json({
message:
"Welcome Admin Dashboard"
});

}
);

router.get(
"/superadmin",
protect,
authorize("superadmin"),
(req,res)=>{

res.json({
message:
"Welcome Super Admin Dashboard"
});

}
);

module.exports=router;