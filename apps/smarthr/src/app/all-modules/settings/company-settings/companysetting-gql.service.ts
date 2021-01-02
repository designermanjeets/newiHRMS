import {Injectable} from '@angular/core';
import {Mutation} from 'apollo-angular';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class RegisterCompanyGQL extends Mutation {
  document = gql`
    mutation CreateCompany(
      $companyname: String,
      $address1: String,
      $address2: String,
      $countryid: String,
    ) {
    createCompany(
      companyname: $companyname,
      address1: $address1,
      address2: $address2,
      countryid: $countryid,
    ) {
        companyname,
        address1,
        address2,
        countryid
      }
  }
  `;
}


@Injectable({
  providedIn: 'root',
})
export class UpdateCompanyGQL extends Mutation {
  document = gql`
    mutation updateCompany(
      $companyname: String
      $address1: String
      $address2: String
      $countryid: String
      $corporateID: String
      $stateid: String
      $cityid: String
      $zipcode: String
      $email: String
      $financialbegindate: ISODate
      $booksbegindate: ISODate
      $cinno: String
      $panno: String
      $gstin: String
      $currencyid: String,
      $modifiedby: String,
      $modifiedon: ISODate,
      $modifiedip: String,
    ) {
    updateCompany(
      companyname: $companyname
      address1: $address1
      address2: $address2
      countryid: $countryid
      corporateID: $corporateID
      stateid: $stateid
      cityid: $cityid
      zipcode: $zipcode
      email: $email
      financialbegindate: $financialbegindate,
      booksbegindate: $booksbegindate,
      cinno: $cinno
      panno: $panno
      gstin: $gstin
      currencyid: $currencyid,
      modifiedby: $modifiedby,
      modifiedon: $modifiedon,
      modifiedip: $modifiedip
    ) {
        companyname
        address1
        address2
        countryid
        corporateID
        stateid
        cityid
        zipcode
        email
        financialbegindate
        booksbegindate,
        cinno
        panno
        gstin
        currencyid
        modifiedby
        modifiedon
        modifiedip
      }
  }
  `;
}


@Injectable({
  providedIn: 'root',
})
export class DeleteCompanyGQL extends Mutation {
  document = gql`
    mutation deleteCompany(
      $corporateID: String
    ) {
    deleteCompany(
      corporateID: $corporateID
    ) {
        corporateID
      }
  }
  `;
}

export const GET_COMPANY_QUERY = gql`
   query getCompany(
      $corporateID: String!
    ) {
    getCompany(
      corporateID: $corporateID
    ) {
        companyname
        address1
        address2
        countryid
        corporateID
        stateid
        cityid
        zipcode
        email
        financialbegindate
        booksbegindate
        cinno
        panno
        gstin
        currencyid
        modifiedby
        modifiedon
        modifiedip
        createdon
        createdby
        createdip
      }
  }
`;

export const GET_COMPANIES_QUERY = gql`
   query getCompanies(
      $pagination: Pagination!
    ) {
    getCompanies(
      query: $pagination,
    ) {
        corporateID
      }
  }
`;
