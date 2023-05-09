export enum AppStatus {
  CONFIGURATION_ERROR = 1000,
}

export enum PostgresError {
  UNIQUE_CONSTRAINT_VIOLATION = '23505',
  INVALID_INPUT_SYNTAX = '22P02',
}
