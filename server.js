'use strict'
const express=require('express')
const cors=require('cors')
const mongoose =require('mongoose')
const axios=require('axios')
require("dotenv").config()
const server=express()
server.use(cors())
server.use(express.json())
const PORT=process.env.PORT
//listen fun
server.listen(PORT,()=>{
    console.log('my Port ',PORT)
})






mongoose.connect('mongodb://localhost:27017/bookdb', {useNewUrlParser: true, useUnifiedTopology: true});

const ColerSchema = new mongoose.Schema({
    title: String,
    imageUrl:String
  });
  const OwnerSchema = new mongoose.Schema({
   email:String,
   colorArr:[ColerSchema]
  });

  const OwnerModel = mongoose.model('ownercolor',OwnerSchema );


  function seed(){
      const Razan=new OwnerModel({
          email:"quraanrazan282@gmail.com",
          colorArr:[{
            title: 'black',
            imageUrl:"http://www.colourlovers.com/img/000000/100/100/Black.png"

          }]

      })
      const eman=new OwnerModel({
        email:"emkhareez19@gmail.com",
        colorArr:[{
          title:'blue',
          imageUrl:"http://www.colourlovers.com/img/1693A5/100/100/dutch_teal.png"

        }]

    })
    Razan.save()
    eman.save()
  }
//   seed()
//http://localhost:3007
server.get('/',test)
//http://localhost:3007/getfav?email=emkhareez19@gmail.com
server.get("/getfav",getfavdata)
////http://localhost:3007/delfun/1?email=emkhareez19@gmail.com
server.delete('/delfun/:idx',delfunction)
server.put('/updateFun/:idx',updateFunction)
// http://localhost:3007/getfromAPI
server.get('/getfromAPI',getdatafromAPI)
server.post('/addToDB',addToDBfun)

function test(req,res){
    res.send('good all')
}
function getfavdata(req,res){
    console.log('gggggg',req.query);
    let email=req.query.email
    OwnerModel.find({email:email},(error,data)=>{
        if(error){
            res.send(error)
        }
        else{
            res.send(data[0].colorArr)
        }
    })

}
function delfunction(req,res){
    const index=Number(req.params.idx)
    const email=req.query.email
    OwnerModel.find({email:email},(error,datadel)=>{
        if(error){
            res.send(error)
        }
        else{
           let dataafterdel= datadel[0].colorArr.filter((item,indx)=>{
                return indx!==index
            })
            datadel[0].colorArr=dataafterdel
            datadel[0].save()
            res.send(datadel[0].colorArr)
        }
    })
    
}

function updateFunction(req,res){
    const idx= Number( req.params.idx)
    const email=req.query.email
    const{ title, imageUrl}=req.body
    
    OwnerModel.find({email:email},(error,dataupdate)=>{
     if(error){
         res.send(error)
     }
     else{
         dataupdate[0].colorArr.splice(idx,1,{
            title:title,
            imageUrl:imageUrl

         })
         dataupdate[0].save()
         res.send( dataupdate[0].colorArr)
     }
    })
}
let arrayResult=[]
function getdatafromAPI (req,res){
    axios.get("https://ltuc-asac-api.herokuapp.com/allColorData")
    .then(result=>{
        arrayResult=result.data.map((item,index)=>{
            return new Color(item) 
        })
        res.send(arrayResult)
    
    })


}



function addToDBfun(req,res){
    const email=req.query.email
    const {title,imageUrl}=req.body
    OwnerModel.find({email:email},(error,data)=>{
        data[0].colorArr.push({
            title: title,
    imageUrl:imageUrl
        })
        data[0].save()
        res.send( data[0].colorArr)
    })
}

class Color{
    constructor(item){
        this.title=item.title;
        this.imageUrl=item.imageUrl
    }
}
