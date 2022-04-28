import { DataSource } from "typeorm";
import config from "./type-rom.config";

export const AppDataSource = new DataSource(config);
