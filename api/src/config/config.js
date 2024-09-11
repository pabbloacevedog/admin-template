import { config } from "dotenv"
config()
export const PORT = process.env.PORT
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRES = process.env.JWT_EXPIRES
export const NODE_ENV = process.env.NODE_ENV
export const CLIENT = process.env.CLIENT
export const BASE_URL = process.env.BASE_URL

export const DB_HOST = process.env.DB_HOST
export const DB_USER = process.env.DB_USER
export const DB_PASS = process.env.DB_PASS
export const DB_NAME = process.env.DB_NAME
export const DB_FORCE_RESTART = process.env.DB_FORCE_RESTART

export const ROUTE_UPLOAD = process.env.ROUTE_UPLOAD
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)
export const PASSPHRASE = process.env.PASSPHRASE

export const EMAIL_USER = process.env.EMAIL_USER
export const EMAIL_PASS = process.env.EMAIL_PASS
export const RESET_PASSWORD_URL = process.env.RESET_PASSWORD_URL
