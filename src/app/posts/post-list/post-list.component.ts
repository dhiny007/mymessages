import { Component, OnInit, OnDestroy} from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

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
  pageLength=0;
  pageLimit=2;
  currentPage=1;
  pageSizeOptions=[1,2,5,10];

  constructor(private postsService:PostsService) { }

  ngOnInit(){
    this.postsService.getPosts(this.pageLimit,this.currentPage);
    this.isLoading=true;
    this.postSub=this.postsService.getPostUpdateListener().subscribe((postData:{posts:Post[],count:number}) => {
      this.posts=postData.posts;
      this.pageLength=postData.count;
      this.isLoading=false;
    })
  }

  onPageChange(pageData:PageEvent){
    this.currentPage=pageData.pageIndex+1;
    this.pageLimit=pageData.pageSize;
    this.postsService.getPosts(this.pageLimit,this.currentPage);
  }

  onDelete(postId:string){
    this.isLoading=true;
    this.postsService.deletePost(postId).subscribe(()=>
      this.postsService.getPosts(this.pageLimit,this.currentPage)
    );
  }

  ngOnDestroy(){
    this.postSub.unsubscribe();
  }

}
