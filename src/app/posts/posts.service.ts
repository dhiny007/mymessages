import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn:"root"
})
export class PostsService{
  private posts:Post[]=[];
  private postSubject=new Subject<{posts:Post[],count:number}>();

  constructor(private http:HttpClient, private router:Router){}

  getPosts(pageSizeParam:number,currentPageParam:number){
    const queryParams=`?pageSize=${pageSizeParam}&currentPage=${currentPageParam}`;
    this.http.get<{message:string,posts:any,maxPosts:number}>('http://localhost:3000/api/posts' +queryParams)
    .pipe(
      map(
        (postData) => {
          return {
            posts:postData.posts.map(
            (post) => {
              return {
                title:post.title,
                content:post.content,
                id:post._id,
                imagePath:post.imagePath,
                creator:post.creator
              };
            }
          ),
          maxPosts:postData.maxPosts
        }}
      )
    )
    .subscribe(
      transformedPostData => {
        this.posts=transformedPostData.posts;
        this.postSubject.next({posts:[...this.posts],count:transformedPostData.maxPosts});
      });
  }

  getPostUpdateListener(){
    return this.postSubject.asObservable();
  }

  getPost(id:string){
    // return {...this.posts.find(pId => pId.id ===id)};
    return this.http.get<{_id:string;title:string;content:string,imagePath:string,creator:string}>('http://localhost:3000/api/posts/' + id);
  }

  addPosts(title:string,content:string,image:File){
    //console.log(title,content);
    //const post: Post = {id:null,title:title,content:content};
    const postData=new FormData();
    postData.append('title',title);
    postData.append('content',content);
    postData.append('image',image,title);
    this.http.post<{message:string,post:Post}>('http://localhost:3000/api/posts',postData).subscribe(
      responseData => {
        this.router.navigate(['']);
      }
    )
  }

  updatePost(id:string,title:string,content:string,image:File|string){
    let postData;
    if(typeof(image)=='object'){
      postData=new FormData();
      postData.append('id',id);
      postData.append('title',title);
      postData.append('content',content);
      postData.append('image',image,title);
    }
    else{
      postData= {id:id,title:title,content:content,imagePath:image,creator:null};
    }
    this.http.put('http://localhost:3000/api/posts/' + id,postData).subscribe(
      response => {
        this.router.navigate(['']);
      }
    )
  }

  deletePost(id:String){
    return this.http.delete("http://localhost:3000/api/posts/" + id);
  }
}
