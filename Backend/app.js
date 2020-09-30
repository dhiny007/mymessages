const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const postsRouter=require('./Routes/posts');
const userRoutes=require('./Routes/userAuth');

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
app.use('/images',express.static(path.join('Backend/images')));

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});


app.use('/api/posts',postsRouter);
app.use('/api/user',userRoutes);

module.exports=app;
