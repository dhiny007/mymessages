import { Component, OnInit, OnDestroy} from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy {

  // posts=[
  //   {title:'First Post',content:'First Post Content'},
  //   {title:'Second Post',content:'Second Post Content'},
  //   {title:'Third Post',content:'Third Post Content'}
  // ]
  posts:Post[]=[];
  postSub:Subscription;
  isLoading=false;

  constructor(private postsService:PostsService) { }

  ngOnInit(){
    this.postsService.getPosts();
    this.isLoading=true;
    this.postSub=this.postsService.getPostUpdateListener().subscribe((posts:Post[]) => {
      this.posts=posts;
      this.isLoading=false;
    })
  }

  onDelete(postId:string){
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(){
    this.postSub.unsubscribe();
  }

}
