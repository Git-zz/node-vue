const mongoose=require('mongoose')
const schema=new mongoose.Schema({
    name:{type:String},
    title:{type:String},
    cover:{type:String},
    categories:[{type:mongoose.SchemaTypes.ObjectId,ref:'Category'}],
    body:{type:String}
},{
    timestamps:true
})
module.exports=mongoose.model('Game',schema)