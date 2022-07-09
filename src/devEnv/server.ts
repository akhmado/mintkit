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


/* Start */
app.listen(3000, () => {
  console.log('Server running on port 3000');
})