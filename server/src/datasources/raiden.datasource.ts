import {juggler} from '@loopback/service-proxy';

export const RaidenDataSource: juggler.DataSource = new juggler.DataSource({
  name: 'Raiden',
  connector: 'rest',
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: 'http://192.168.0.4:5002/api/1/payments/{token}/{target}',
        responsePath: '$[0]',
      },
      functions: {
        payments: ['token', 'target'],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://192.168.0.4:5002/api/1/payments/{token}/{target}',
        body: {
          amount: "{amount:number}",
          identifier: "{identifier:number}"
        },
        responsePath: '$',
      },
      functions: {
        pay: ['token', 'target', 'amount', 'identifier'],
      },
    },
  ],
});
