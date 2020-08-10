import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  styleUrls: ['./pagination.component.scss'],
  template: `
    <ul class="pagination" *ngIf="pagination?.arrayLeft">

      <li>
        <button type="button" *ngIf="currentParams.page !== 1"
          (click)="prevPage.emit($event)">
          prev
        </button>
      </li>

      <li *ngFor="let page of pagination.arrayLeft">
        <button type="button"
          [class.active]="page === currentParams.page"
          (click)="gotoPage.emit(page)">
          {{ page }}
        </button>
      </li>

      <ng-container *ngIf="pagination.arrayRight">
        <li class="benign">. . .</li>
        <li *ngFor="let page of pagination.arrayRight">
          <button type="button"
            [class.active]="page === currentParams.page"
            (click)="gotoPage.emit(page)">
            {{ page }}
          </button>
        </li>
      </ng-container>

      <li>
        <button type="button" *ngIf="pagination.arrayLeft.length > 1"
          (click)="nextPage.emit($event)">
          next
        </button>
      </li>
      
    </ul>
  `
})
export class PaginationComponent {
  
  @Input() pagination: any;
  @Input() currentParams: any;

  @Output() gotoPage = new EventEmitter();
  @Output() prevPage = new EventEmitter();
  @Output() nextPage = new EventEmitter();

}
