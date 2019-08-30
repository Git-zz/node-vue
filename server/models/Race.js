const mongoose=require('mongoose')
const schema=new mongoose.Schema({
    title:{type:String},
    categories:[{type:mongoose.SchemaTypes.ObjectId,ref:'Category'}],
    cover:{type:String},
    click:{type:String},
    body:{type:String},
    avatar:{type:String},
    articleNum:{type:Number},
    fansNum:{type:Number}
},{
    timestamps:true
})
module.exports=mongoose.model('Race',schema)