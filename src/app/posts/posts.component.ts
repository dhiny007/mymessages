import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from './post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  constructor(private postsService:PostsService) { }

  ngOnInit(): void {
  }

  onAddPost(form:NgForm){
    if(form.invalid){
      return;
    }

    this.postsService.addPosts(form.value.title,form.value.content);
    form.resetForm();
  }

}
