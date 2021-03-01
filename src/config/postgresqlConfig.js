export const db_connect = {
  development: {
    username: 'eluly',
    password: 'eluly!',
    database: 'eluly',
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,
    port: 5432
  },
  test: {
    username: 'eluly',
    password: 'eluly!',
    database: 'eluly_test',
    host: 'localhost',
    dialect: 'postgres',
    port: 5432
  },
  production: {
    username: 'eluly',
    password: 'eluly!',
    database: 'eluly_production',
    host: 'localhost',
    dialect: 'postgres',
    port: 5432
  }
}