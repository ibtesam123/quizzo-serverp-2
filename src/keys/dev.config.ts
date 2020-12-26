export enum DevEnv {
    PRODUCTION = "production",
    DEVELOPMENT = "development"
}

export class DevConfig {
    NODE_ENV: DevEnv
}