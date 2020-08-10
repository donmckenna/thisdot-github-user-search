import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-list',
  styleUrls: ['./user-list.component.scss'],
  template: `
    <ul class="user-list">
      <li *ngFor="let user of users">

        <img [src]="user.avatar_url" />

        <div class="info">
          <h2><a [href]="user.html_url">{{ user.name ? user.name : user.login }}</a></h2>
          <p class="location" *ngIf="user.location">{{ user.location }}</p>
          <p *ngIf="user.bio">{{ user.bio }}</p>
        </div>
        
        <ul class="stats">
          <li><p><span>followers</span>{{ user.followers }}</p></li>
          <li><p><span>following</span>{{ user.following }}</p></li>
          <li><p><span>public repos</span>{{ user.public_repos }}</p></li>
          <li><p><span>public gists</span>{{ user.public_gists }}</p></li>
          <!-- <li><p><span>stargazers</span>{{ formatStargazerCount(user) }}</p></li> -->  <!-- makes github mad :( -->
        </ul>

      </li>
    </ul>
  `
})
export class UserListComponent {
  
  @Input() users: any[];

}
