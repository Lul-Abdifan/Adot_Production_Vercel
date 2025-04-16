import dotenv from "dotenv"
dotenv.config()

class BaseConfig {
  env: string
  apiUrl: string

  constructor() {
    this.env = process.env.NODE_ENV || "development"
    this.apiUrl = process.env.NEXT_PUBLIC_DEV_API_URL || ""
  }
}

class ProdConfig extends BaseConfig {
  constructor() {
    super()
    this.apiUrl = process.env.NEXT_PUBLIC_PROD_API_URL!
  }
}

class DevConfig extends BaseConfig {
  constructor() {
    super()
  }
}

const getConfig = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return new ProdConfig()
    default:
      return new DevConfig()
  }
}

export const config = getConfig()