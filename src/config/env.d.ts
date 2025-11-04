declare namespace NodeJS {
  export interface ProcessEnv {
    // app config
    NODE_ENV: string;
    HOST: string;
    PORT: string;

    // logging config
    LOGGING_LEVEL: string;

    // auth config
    JWT_SECRET: string;
    JWT_TOKEN_EXPIRES: string;

    // database
    DATABASE_URL: string;
  }
}
