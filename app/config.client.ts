// encapsulates browser "env vars"
export interface BrowserConfig {
  env: string;
  sentryDSN: string;
  release: string;
  oneClickEnabled: boolean;
  noticeEnabled: boolean;
  noticeText: string;
  bookACallUrl: string;
  dummyDataUrl: string;
  realDataUrl: string;
  dummyEnvCoreServiceUrl: string;
  realEnvCoreServiceUrl: string;
  googlePlacesApiKey: string;
}

export const browserConfig: BrowserConfig =
  window.ENV as unknown as BrowserConfig;
