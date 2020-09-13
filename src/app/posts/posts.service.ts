import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn:"root"
})
export class PostsService{
  private posts:Post[]=[];
  private postSubject=new Subject<Post[]>();

  constructor(private http:HttpClient){}

  getPosts(){
    this.http.get<{message:string,posts:any}>('http://localhost:3000/api/posts')
    .pipe(
      map(
        (postData) => {
          return postData.posts.map(
            (post) => {
              return {
                title:post.title,
                content:post.content,
                id:post._id
              }
            }
          )
        }
      )
    )
    .subscribe(
      transformedPosts => {
        this.posts=transformedPosts;
        this.postSubject.next([...this.posts]);
      });
  }

  getPostUpdateListener(){
    return this.postSubject.asObservable();
  }

  addPosts(title:string,content:string){
    console.log(title,content);
    const post: Post = {id:null,title:title,content:content};
    this.http.post<{message:string,postId:string}>('http://localhost:3000/api/posts',post).subscribe(
      responseData => {
        const id=responseData.postId;
        post.id=id;
        this.posts.push(post);
        this.postSubject.next([...this.posts]);
      }
    )
  }

  deletePost(id:String){
    this.http.delete("http://localhost:3000/api/posts/" + id)
    .subscribe(
      () => {
        console.log('Post successfully deleted!');
        const updatedPosts=this.posts.filter(post => post.id !== id);
        this.posts=updatedPosts;
        this.postSubject.next([...this.posts]);
      }
    );
  }
}
