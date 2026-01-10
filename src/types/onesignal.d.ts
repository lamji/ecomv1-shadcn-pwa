declare module 'onesignal' {
  export default class OneSignal {
    static init(options: {
      appId: string;
      notifyButton?: {
        enable: boolean;
      };
      allowLocalhostAsSecureOrigin?: boolean;
    }): Promise<void>;

    static on(event: string, callback: (event: any) => void): void;

    static registerForPushNotifications(): Promise<any>;
  }
}
