const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const postsRouter=require('./Routes/posts');

const app=express();

// mongoose.connect('mongodb+srv://Dhiny:dLzDDnZPp2FgTNcO@cluster0.gb6ip.mongodb.net/node-angularDB?retryWrites=true&w=majority')
// .then(() => {
//   console.log('Connection Succeeded!');
// })
// .catch(() => {
//   console.log('Connection failed!');
// })

mongoose.connect('mongodb://localhost:27017/node-angularDB',{useNewUrlParser: true})
.then(() => {
  console.log('Connection Succeeded!');
})
.catch(() => {
  console.log('Connection failed');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});


app.use('/api/posts',postsRouter);

module.exports=app;
