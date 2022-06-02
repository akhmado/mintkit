import express from 'express';
import {MintKit} from '../index';

const app = express();

const kit = new MintKit(app, {
  apiPrefix: 'api',
  filesUpload: {
    servingURL: 'static',
    folderLocation: '/Users/akhmad/Desktop/MintKit/uploads'
  }
});

kit.view({
  entity: 'book',
  files: {
    fileName: 'image',
    fileTableCell: 'image'
  }
})

kit.view({
  entity: 'people',
})





















/* Typeorm */
import {DataSource} from "typeorm";
import {Food} from "../../typeorm/Food";
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