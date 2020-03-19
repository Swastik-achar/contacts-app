const mongoose= require('mongoose')

const setUpDB=()=>{
    mongoose.connect("mongodb://localhost:27017/contacts-app")
    .then(()=>{
        console.log( "connected to DB")
    })
    .catch(err=>{
        console.log(err)
    })
}
module.exports= setUpDB