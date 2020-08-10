import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { CurrentParams, CurrentResultsData, Pagination } from '../models';

@Injectable({ providedIn: 'root' })
export class UserSearchService {

  currentParams: CurrentParams;
  currentResultsData: Partial<CurrentResultsData> = {};
  
  constructor(private http: HttpClient) {}
  
  /**
   * Pagination layout determined by currentParams and currentResultsData
   */
  get paginationLayout(): Pagination {
    if (this.currentParams) {
      // constants
      const arraySplitLength = 5;
      const maxResults = 1000;
      const maxPages = Math.ceil(maxResults / this.currentParams.per_page); 
      const pageMax = Math.ceil(this.currentResultsData.total_count / this.currentParams.per_page);
      // page number holders
      let arrayLeft = [];
      let arrayRight = [];
      // ------------------------------
      // if total pages needed for results is less than 10
      // return an array of consecutive numbers, up to the max result
      if (pageMax <= 10) {
        return { arrayLeft: Array.from(Array(pageMax), (_, i) => i + 1) };
      // ------------------------------
      // if total pages needed for results is larger than github allows
      // "max out" left and right arrays with max pages needed 
      } else if (pageMax >= maxPages) {
        arrayLeft = Array.from(Array(arraySplitLength), (_, i) => i + 1);
        const totalCountOffset = maxPages - arraySplitLength;
        arrayRight = Array.from(Array(arraySplitLength), (_, i) => i + totalCountOffset);
      // ------------------------------
      // default simply make left and right arrays from
      // min and max total_pages
      } else {
        arrayLeft = Array.from(Array(arraySplitLength), (_, i) => i + 1);
        const totalCountOffset = pageMax - arraySplitLength;
        arrayRight = Array.from(Array(arraySplitLength), (_, i) => i + totalCountOffset);
      }
      // ------------------------------
      return {arrayLeft, arrayRight};
    }
  }
  
  /**
   * Retrieves a list of Github users and gets additional details
   * via nested observable.
   * 
   * @param q Github username to be queried.
   * @param page Desired page number.
   * @param per_page Search items per page.
   */
  byName(q: string, page = 1, per_page = 12): Observable<any> {
    // store current params for later use
    this.currentParams = { q, page, per_page };
    // HttpParams require strings, not numbers
    const params = { q, page: page.toString(), per_page: per_page.toString() };
    // fetch users from params
    return this.http.get(`https://api.github.com/search/users`, {params}).pipe(
      // store current data for later use
      tap((results: any) => this.currentResultsData.total_count = results.total_count),
      // isolate users from metadata
      map((results: any) => results.items),
      // get individual user data from user url
      switchMap(users => forkJoin( users.map(user => this.http.get(user.url)) )),

      // ------------------------------
      //  this gets a minimum total of stargazers for a user's repos.
      //  but it's a bit overkill and github's default rate limiting is kicking in.
      //  leaving this here to show the idea of fetching another hierachical
      //  level deep within the same observable, but commenting it out because
      //  it makes github mad.
      // ------------------------------
        // // get repo data. only partial data if repo count > 100
        // switchMap(users => forkJoin( users.map((user: any) => this.http.get(`${user.url}/repos?per_page=100`)
        //   .pipe(map((repos: any[]) => {
        //     if (repos.length) {
        //       // add up queried user repo stargazer count
        //       const total_stargazers = repos
        //         .map(repo => repo.stargazers_count)
        //         .reduce((a, b) => a + b);
        //       // add total repo stargazer info to returned observable
        //       return { ...user, total_stargazers, total_repos: repos.length };
        //     // if no repos available, just return the original user
        //     } else { return user; }
        //   }))
        // )) ),
      // ------------------------------
      // ------------------------------

    );
  }


}
