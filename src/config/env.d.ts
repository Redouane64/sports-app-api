declare namespace NodeJS {
  export interface ProcessEnv {
    // app config
    NODE_ENV: string;
    HOST: string;
    PORT: string;

    // logging config
    LOGGING_LEVEL: string;
  }
}
