const express=require('express');
const multer=require('multer');

const Post=require('../Models/post');
const checkAuth=require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP={
  'image/png':'png',
  'image/jpeg':'jpg',
  'image/jpg':'jpg'
};

const storage=multer.diskStorage({
  destination: (req,file,cb) => {
    const isValid=MIME_TYPE_MAP[file.mimetype];
    let error=new Error('Invalid Mime Type!');
    if(isValid){
      error=null;
    }
    cb(error,'Backend/images');
  },
  filename: (req,file,cb) => {
    const name=file.originalname.toLowerCase().split(' ').join('-');
    const ext=MIME_TYPE_MAP[file.mimetype];
    cb(null,name+'-'+Date.now()+ '.' + ext);
  }
})

router.post('',checkAuth,multer({storage:storage}).single('image'),(req,res,next) => {
  const url=req.protocol+"://"+req.get('host');
  const post=new Post({
    title:req.body.title,
    content:req.body.content,
    imagePath:url+'/images/'+req.file.filename,
    creator:req.userData.userId
  });
  console.log(req.userData);
  post.save().then(createdPost => {
      console.log(createdPost);
      res.status(201).json({
        message:'Post added successfully',
        post:{
        ...createdPost,
        postId: createdPost._id
        }
      });
    }
  );
});

router.get('',(req,res,next) => {
  const pageSize=+req.query.pageSize;
  const currentPage=+req.query.currentPage;
  const postQuery=Post.find();
  let fetchedPosts;
  if(currentPage && pageSize){
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize)
  }
  postQuery.then(
    (documents) => {
      fetchedPosts=documents;
      return Post.count()
    }
  )
  .then(count => {
    res.status(200).json({
      message:'Posts were sent successfully',
      posts:fetchedPosts,
      maxPosts:count
    })
  })
});

router.get('/:id',(req,res,next) => {
  Post.findById(req.params.id).then(
    post =>{
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(404).json({
        message:'Post not found'
      });
    }
  }
  )
});

router.put('/:id',checkAuth,multer({storage:storage}).single('image'),(req,res,next) => {
  let imagePath=req.body.imagePath;
  if(req.file){
    const url=req.protocol+"://"+req.get('host');
    imagePath=url+'/images/'+req.file.filename;
  }
  const post= new Post({
    _id:req.body.id,
    title:req.body.title,
    content:req.body.content,
    imagePath:imagePath,
    creator:req.userData.userId
  });
  Post.updateOne({_id:req.params.id,creator:req.userData.userId},post).then(
    (result) => {
      if(result.nModified>0){
        console.log('Post was updated successfully!');
        res.status(200).json({
          message:'Update successful'
        })
      }
      else{
        res.status(401).json({
          message:'Unauthorized user!'
        })
      }

    }
  )
});

router.delete('/:id',checkAuth,(req,res,next) => {
  Post.deleteOne({_id:req.params.id,creator:req.userData.userId}).then(
    (result) => {
      console.log(result);
      if(result.n>0){
        console.log(result);
        res.status(200).json({
        message:'Post was deleted successfully'
      });
      }
      else{
        res.status(401).json({
          message:'Delete attempt from unauthorized user!'
        })
      }
    }
  )
});

module.exports=router;
