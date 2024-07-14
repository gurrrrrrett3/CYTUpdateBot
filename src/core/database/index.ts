import { MikroORM, PostgreSqlDriver, EntityManager } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { Logger } from "../utils/logger.js";

export default class Database {

    private _orm!: MikroORM
    private _em!: EntityManager<PostgreSqlDriver>
    private logger = new Logger("Database")

    public init(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const orm = await MikroORM.init<PostgreSqlDriver>({
                entities: ["./dist/modules/**/entities/*.js"],
                type: "postgresql",
                tsNode: true,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                dbName: process.env.DB_NAME,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
                metadataProvider: TsMorphMetadataProvider
            }).catch((err) => {
                this.logger.error("Failed to initialize database")
                console.error(err)
                reject()
                process.exit(1)
            })

            this._orm = orm
            this._em = orm.em

            this.logger.info("Database initialized")

            resolve()
        })
    }

    public async close(): Promise<void> {
        await this.orm.close(true)
    }

    public get em(): EntityManager<PostgreSqlDriver> {
        if (!this._em) {
            throw new Error("Database not initialized")
        }
        return this._em.fork()
    }

    public get orm(): MikroORM {
        return this._orm
    }
}