const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const Post=require('./Models/post');

const app=express();

mongoose.connect('mongodb+srv://Dhiny:dLzDDnZPp2FgTNcO@cluster0.gb6ip.mongodb.net/node-angularDB?retryWrites=true&w=majority')
.then(() => {
  console.log('Connection Succeeded!');
})
.catch(() => {
  console.log('Connection failed!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,PATCH,OPTIONS');
  next();
});

app.post('/api/posts',(req,res,next) => {
  const post=new Post({
    title:req.body.title,
    content:req.body.content
  });
  post.save().then(createdPost => {
      console.log(createdPost);
      res.status(201).json({
        message:'Post Added Successfully',
        postId: createdPost._id
      });
    }
  );
});

app.get('/api/posts',(req,res,next) => {
  Post.find().then(
    (documents) => {
      console.log('Post fetched successfully!');
      res.status(200).json({
        message:'Posts were sent successfully',
        posts:documents
      })
    }
  )
});

app.delete('/api/posts/:id',(req,res,next) => {
  Post.deleteOne({_id:req.params.id}).then(
    (result) => {
      console.log(result);
      res.status(200).json({
        message:'Post was deleted successfully'
      });
    }
  )
});



module.exports=app;
