import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';

const uri = 'http://localhost:5000/graphql'; // <-- add the URL of the GraphQL server here
const uploadLink = createUploadLink({ uri: uri });

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('JWT_TOKEN');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

export function createApollo(httpLink: HttpLink) {
  return {
    link: ApolloLink.from([ authLink, uploadLink ]),
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
export class GraphQLModule {}
