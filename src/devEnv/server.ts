import express from 'express';
import bodyParser from "body-parser";
import {MintKit} from '../index';

const app = express();
app.use(bodyParser.json());

const kit = new MintKit(app, { apiPrefix: 'api' });

kit.view({
  entity: 'Book',
  validation: { enabled: true }
})



















/* Typeorm */
import {DataSource} from "typeorm";
/* Typeorm */
// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: "localhost",
//   port: 5432,
//   username: "postgres",
//   password: "postgres",
//   database: "mintkit-typeorm",
//   synchronize: true,
//   logging: false,
//   entities: [Food]
// })
//
// AppDataSource.initialize()
//   .then((dataSource) => {
//     /* Mint */
//     const mint = new MintKit({
//       ormType: 'typeorm',
//       dataSource,
//       app,
//     });
//
//     mint.view({ entity: 'food' })
//     // mint.autopilot()
//   })

/* Start */
app.listen(3000, () => {
  console.log('Server running on port 3000');
})