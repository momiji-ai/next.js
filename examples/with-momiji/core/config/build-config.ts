export type BuildConfig = {
  clientId: string;
  tokenEndpointURL: string;
  authorizeEndpointURL: string;
};
export function getBuildConfig(): BuildConfig {
  return {
    clientId: process.env['MOMIJI_CLIENT_ID'] || '',
    tokenEndpointURL: process.env['MOMIJI_TOKEN_ENDPOINT_URL'] || '',
    authorizeEndpointURL: process.env['AUTHORIZE_ENDPOINT_URL'] || '',
  };
}
