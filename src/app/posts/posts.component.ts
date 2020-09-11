import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from './post.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  enteredTitle:string='';
  enteredContent:string='';
  @Output() postDetails=new EventEmitter<Post>();

  constructor() { }

  ngOnInit(): void {
  }

  onAddPost(form:NgForm){
    if(form.invalid){
      return;
    }
    let postContent:Post={
      title:form.value.title,
      content:form.value.content
    };
    this.postDetails.emit(postContent);
  }

}
