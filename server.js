const express=require('express');
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken');
const cors=require('cors');
const app=express();
const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://kam:kam@cluster0.r6cmb.mongodb.net/?retryWrites=true&w=majority').then(val=>{
	console.log('mongodb connected')
})    
const userSchema=new mongoose.Schema({
	username:String,
	password:String,
})
const foodSchema=new mongoose.Schema({
	title:String,
	image:String,
	ingredients:String,
	steps:String,
	author:String
})
const Food=new mongoose.model('Food',foodSchema)
const Quser=new mongoose.model('Quser',userSchema) 
app.use(express.json())
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
/*const path = __dirname + '/views/';
app.use(express.static(path));*/
app.post('/login',(req,res)=>{
	const username=req.body.username
	const password=req.body.Password
	console.log("logged")
	Quser.findOne({username,password},(err,val)=>{
	if (val!=null){
		const token=generateAccessToken(String(val._id))
		res.json({auth:true,token,id:String(val._id)})
	}else{
		res.json({auth:false})
	}		
	})

})
app.post('/signup',(req,res)=>{ 
	const username=req.body.username
	const password=req.body.Password
	 Quser.findOne({username},(err,val)=>{
		console.log(val)
		if (val!=null){
			res.json({created:false,repeat:true})
		}else{
			const nuser1= new Quser({username,password})
			nuser1.save()
			const token=generateAccessToken(String(nuser1._id))
			res.json({created:true,token})
		}
	})
})
app.post('/home',async(req,res)=>{
	const token=req.body.token
	jwt.verify(token,'secretString',(err,val)=>{
		if(err){
			res.json({auth:false})
		}else{
			res.json({auth:true,id:val})
		}
	})
})
app.post('/post',(req,res)=>{
	const {id,text,Ingredients,title,imge}=req.body
	if(text!=undefined){
	Quser.findOne({_id:id},(err,val)=>{
		const newuser=new Food({title:title,
	image:imge,
	ingredients:Ingredients,
	steps:text,
	author:val.username})
		newuser.save().then(val=>{
			console.log(val)
		})
		res.json({posted:true})
	})}else{res.json({posted:false})}
})
app.post('/search',(req,res)=>{
	const name=req.body.name
	console.log('name',name)
	if(name!=undefined){
		Food.find({title:name},(err,val)=>{
			if(val.length!==0){
				res.json({found:true,val})
				console.log(val)
			}else{
				res.json({found:false})
			}
		})
	}else{
		res.json({found:false})
	}
})
app.listen(process.env.PORT || 3030,()=>{
	console.log('server started on port 3030')
})

const generateAccessToken=(param)=>{
	const token=jwt.sign(param,'secretString')
	return token
}