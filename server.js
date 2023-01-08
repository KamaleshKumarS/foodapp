const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const app=express();
require('dotenv').config()
app.use(express.json())
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
const path = __dirname + '/views/';
app.use(express.static(path));
app.listen(process.env.PORT || 3030,()=>{
	console.log('front end started on port 3030')
})

