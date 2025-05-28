declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DATABASE_URL: string;
      DATABASE_NAME: string;
      HASH_SALT: number;
      JWT_EXPIRE_TOKEN: string;
      JWT_SECRET_CODE: string;
    }
  }
}

export {};
