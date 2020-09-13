import { Component, OnInit} from '@angular/core';
import { Post } from './post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from './posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  private mode= 'create';
  private id:string;
  post:Post;
  isLoading=false;

  constructor(private postsService:PostsService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap:ParamMap) => {
      if(paramMap.has('postId')){
        this.mode='edit';
        this.id=paramMap.get('postId');
        this.isLoading=true;
        this.postsService.getPost(this.id).subscribe(postData => {
          this.isLoading=false;
          this.post={id:postData._id,title:postData.title,content:postData.content};
        });
      }
      else{
        this.mode='create';
        this.id=null;
      }
    })
  }

  onSavePost(form:NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading=true;
    if(this.mode==='create'){
      this.postsService.addPosts(form.value.title,form.value.content);
    }
    else{
      this.postsService.updatePost(this.id,form.value.title,form.value.content);
    }

    form.resetForm();
  }

}
