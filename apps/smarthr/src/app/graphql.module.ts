import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { AppsServiceService } from './all-modules/apps/apps-service.service';
import { AuthenticationService } from './login/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

const uri = 'http://localhost:5000/graphql'; // <-- add the URL of the GraphQL server here
const uploadLink = createUploadLink({ uri });

let toaster;
let router;

const link = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      // Here you may display a message to indicate graphql error
      // You may use 'sweetalert', 'ngx-toastr' or any of your preference
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      if (message.includes('JWT_EXPIRED')) {
        sessionStorage.setItem('sessionExpire', `${message}`);
        toaster.error(message, 'Error');
        setTimeout( _ => router.navigate(['/login']), 2000);
      }
    });
  }
  if (networkError) {
    // Here you may display a message to indicate network error
    console.log(`[Network error]: ${networkError}`);
  }
});


const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('JWT_TOKEN');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

export function createApollo(httpLink: HttpLink) {
  return {
    link: ApolloLink.from([ link, authLink, uploadLink ]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
      },
    },
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {
  constructor(
    public routr: Router,
    public toastr: ToastrService
  ) {
    toaster = this.toastr;
    router = this.routr;
  }
}
