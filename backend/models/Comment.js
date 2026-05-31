const mongoose=require("mongoose");

const commentSchema=
new mongoose.Schema({

blog:{
type:mongoose.Schema.Types.ObjectId,
ref:"Blog"
},

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

content:{
type:String,
required:true
}

},
{
timestamps:true
}
);

module.exports=
mongoose.model(
"Comment",
commentSchema
);


//
exports.addComment = async(req,res)=>{

try{

const comment=
await Comment.create({

blog:req.params.blogId,

user:req.user.id,

content:req.body.content

});

res.status(201).json(comment);

}
catch(error){

res.status(500).json(
error.message
);

}

};