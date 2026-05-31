const mongoose=require("mongoose");

const bookmarkSchema=
new mongoose.Schema({

user:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

blog:{
type:mongoose.Schema.Types.ObjectId,
ref:"Blog"
}

});

module.exports=
mongoose.model(
"Bookmark",
bookmarkSchema
);