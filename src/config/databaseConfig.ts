const databaseConfig = {
  db_host: process.env.DB_HOST ?? "localhost",
  db_username: process.env.DB_USERNAME ?? "",
  db_password: process.env.DB_PASSWORD ?? "",
  db_database: process.env.DB_DATABASE ?? "",
  db_port:process.env.DB_PORT ?? 5433
};


const secretStore={
    secretKey:process.env.JWT_TOKEN_SECRET ?? '',
    expiryTime:process.env.JWT_TOKEN_EXPIRATION ?? "",
}

export default {databaseConfig,secretStore};
