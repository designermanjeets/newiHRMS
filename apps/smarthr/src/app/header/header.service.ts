import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import gql from "graphql-tag";

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(private http: HttpClient) {
  }

  getDataFromJson(section) {
    return this.http.get(`assets/json/${section}.json`);
  }

}

export const GET_SYSPARAMETERS_QUERY = gql`
   query getSysparameters (
      $query: Pagination!
    ) {
      getSysparameters(
        query: $query
      ){
        sysparams {
          sysparaname
          sysparavalue
        }
      }
    }
`;
