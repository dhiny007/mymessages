import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Post } from '../post.model';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  // posts=[
  //   {title:'First Post',content:'First Post Content'},
  //   {title:'Second Post',content:'Second Post Content'},
  //   {title:'Third Post',content:'Third Post Content'}
  // ]
  @Input() posts:Post[]=[];
  constructor() { }

  ngOnInit(): void {
  }


}
