import express from 'express';
import bodyParser from "body-parser";
import { MintKit } from '../index';

import {DataSource} from "typeorm";
import {Food} from "../../typeorm/Food";

const app = express();
app.use(bodyParser.json())

// const mint = new MintKit({ app });
// mint.view({ entity: 'book', select: ['id', 'name'] })

/* Typeorm */
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "mintkit-typeorm",
  synchronize: true,
  logging: false,
  entities: [Food],
  subscribers: [],
  migrations: [],
})

AppDataSource.initialize()
  .then((dataSource) => {
    /* Mint */
    const mint = new MintKit({
      ormType: 'typeorm',
      dataSource,
      app,
    });

    mint.view({ entity: 'food' })
    // mint.autopilot()
  })

/* Start */
app.listen(3000, () => {
  console.log('Server running on port 3000');
})