import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreateUpdateSysParametersGQL extends Mutation {
  document = gql`
    mutation createSysPara (
      $sysparams: [sysparamsInput]
  ) {
    createOrUpdateSysparameters(
      sysparams: $sysparams
    ) {
      sysparams {
        sysparaname
        sysparavalue
      }
    }
  }
 `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteSysParametersGQL extends Mutation {
  document = gql`
    mutation deleteSysparameter (
      $id: ID!,
      $sysparams: [sysparamsInput]!
  ) {
    deleteSysparameter(
        id:  $id,
        sysparams: $sysparams
    ){
      _id
      sysparams {
        sysparaname
        sysparavalue
      }
    }
  }
 `;
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
