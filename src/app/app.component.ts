import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSearchService } from './services';
import { CurrentParams, CurrentResultsData, Pagination } from './models/user-search';

@Component({
  selector: 'app-root',
  template: `
    <input type="text" [(ngModel)]="searchQuery" />
    <button type="button" class="search" (click)="searchUsers()">Search Github Users</button>
  
    <p class="count-totals" *ngIf="paginationLayout?.arrayLeft">{{ formatCountTotals(currentResultsData.total_count) }}</p>

    <app-pagination *ngIf="paginationLayout?.arrayLeft"
      [pagination]="paginationLayout"
      [currentParams]="currentParams"
      (gotoPage)="gotoPage($event)"
      (prevPage)="prevPage()"
      (nextPage)="nextPage()">
    </app-pagination>

    <app-user-list *ngIf="users$ | async as users"
      [users]="users">
    </app-user-list>
  `
})
export class AppComponent {
  
  searchQuery: string;

  users$: Observable<any>;

  constructor(private userSearch: UserSearchService) {}

  get paginationLayout(): Pagination { return this.userSearch.paginationLayout; }
  get currentParams(): CurrentParams { return this.userSearch.currentParams; }
  get currentResultsData(): Partial<CurrentResultsData> { return this.userSearch.currentResultsData; }


  searchUsers() {
    this.users$ = this.userSearch.byName(this.searchQuery);
  }

  prevPage() {
    this.users$ = this.userSearch.byName(this.currentParams.q, this.currentParams.page - 1);
  }

  nextPage() {
    this.users$ = this.userSearch.byName(this.currentParams.q, this.currentParams.page + 1);
  }
  
  gotoPage(page: number) {
    this.users$ = this.userSearch.byName(this.currentParams.q, page);
  }
  

  formatCountTotals(count: number) {
    if (count === 1) { return `${count} result`; }
    if (count > 1000) { return `1000 available / ${count} results`; }
    return `${count} results`;
  }
  
  formatStargazerCount(user: any) {
    if (user.total_repos >= 100) { return `${user.total_stargazers} +`; }
    return user.total_stargazers > 0 ? user.total_stargazers : 0;
  }


}
