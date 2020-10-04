import { Component, OnInit, OnDestroy} from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/Auth/auth.service';

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
  authenticationSubs:Subscription;
  isAuthenticated:boolean;
  isLoading=false;
  pageLength=0;
  pageLimit=2;
  currentPage=1;
  pageSizeOptions=[1,2,5,10];
  userId:string;

  constructor(private postsService:PostsService,private authService:AuthService) { }

  ngOnInit(){
    this.postsService.getPosts(this.pageLimit,this.currentPage);
    this.userId=this.authService.getUserId();
    this.isLoading=true;
    this.postSub=this.postsService.getPostUpdateListener().subscribe((postData:{posts:Post[],count:number}) => {
      this.posts=postData.posts;
      this.pageLength=postData.count;
      this.isLoading=false;
    })
    this.authenticationSubs=this.authService.getAuthStatus().subscribe(status=>{
      this.isAuthenticated=status;
      this.userId=this.authService.getUserId();
      return this.isAuthenticated;
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
