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
      $corporateid: String
      $stateid: String
      $cityid: String
      $zipcode: String
      $email: String
      $financialbegindate: String
      $booksbegindate: String
      $cinno: String
      $panno: String
      $gstin: String
      $currencyid: String,
      $modifiedby: String,
      $modifiedon: String,
      $modifiedip: String,
    ) {
    updateCompany(
      companyname: $companyname
      address1: $address1
      address2: $address2
      countryid: $countryid
      corporateid: $corporateid
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
        corporateid
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
      $corporateid: String
    ) {
    deleteCompany(
      corporateid: $corporateid
    ) {
        corporateid
      }
  }
  `;
}

export const GET_COMPANY_QUERY = gql`
   query getCompany(
      $corporateid: String!
    ) {
    getCompany(
      corporateid: $corporateid
    ) {
        companyname
        address1
        address2
        countryid
        corporateid
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
        corporateid
      }
  }
`;
