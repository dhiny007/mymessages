import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostsComponent } from './posts/posts.component';

const routes: Routes = [
  {path:'',component:PostListComponent},
  {path:'create',component:PostsComponent},
  {path:'edit/:postId',component:PostsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
