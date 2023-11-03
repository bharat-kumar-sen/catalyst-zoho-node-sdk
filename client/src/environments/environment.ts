// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
export const environment: any = {
  production: false,
  baseUrl: 'http://localhost:3001/api/v1/',
  // SlessbaseUrl: 'http://localhost:3000/server/',
  SlessbaseUrl: 'https://catalyst-mean-app-60024458376.development.catalystserverless.in/api/v1/',
  // baseUrl: 'http://desktop.amwebtech.org:8001/',
  // baseUrl: 'http://desktop.amwebtech.org:3000/',
  cookieToken: 'zoho1qazxcatasw2C',
  cookieExpirationTime: 10,
  jwtTokenKey: 'catalyst-zoho_JwtTken',
  currentUserKey: 'catalyst-zoho_currentUser',
  role: {
    admin: 1,
    customer: 2,
    supplier: 3
  },
};
