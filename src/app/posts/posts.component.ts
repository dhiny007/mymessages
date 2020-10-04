import { Component, OnInit} from '@angular/core';
import { Post } from './post.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostsService } from './posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  private mode= 'create';
  private id:string;
  post:Post;
  imagePreview:string;
  isLoading=false;
  form:FormGroup;

  constructor(private postsService:PostsService, private route:ActivatedRoute) { }

  ngOnInit(): void {

    this.form=new FormGroup({
      title:new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
      content:new FormControl(null,{validators:[Validators.required]}),
      image:new FormControl(null,{validators:[Validators.required],asyncValidators:mimeType})
    })

    this.route.paramMap.subscribe((paramMap:ParamMap) => {
      if(paramMap.has('postId')){
        this.mode='edit';
        this.id=paramMap.get('postId');
        this.isLoading=true;
        this.postsService.getPost(this.id).subscribe(postData => {
          this.isLoading=false;
          this.post={id:postData._id,title:postData.title,content:postData.content,imagePath:postData.imagePath,creator:postData.creator};
          this.form.setValue({
            title:this.post.title,
            content:this.post.content,
            image:this.post.imagePath
          });
        });
      }
      else{
        this.mode='create';
        this.id=null;
      }
    })
  }

  onImagePicked(event:Event){
    const file=(event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image':file});
    this.form.get('image').updateValueAndValidity();
    const reader=new FileReader();
    reader.onload= () => {
      this.imagePreview=reader.result as string;
     // console.log(this.imagePreview);
    }
    reader.readAsDataURL(file);
    console.log(file);
    console.log(this.form);
  }

  onSavePost(){
    if(this.form.invalid){
      return;
    }
    this.isLoading=true;
    if(this.mode==='create'){
      this.postsService.addPosts(this.form.value.title,this.form.value.content,this.form.value.image);
    }
    else{
      this.postsService.updatePost(this.id,this.form.value.title,this.form.value.content,this.form.value.image);
    }

    this.form.reset();
  }

}
