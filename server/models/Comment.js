const mongoose=require('mongoose')
const schema=new mongoose.Schema({
    body:{type:String}
},{
    timestamps:true
})
module.exports=mongoose.model('Comment',schema)