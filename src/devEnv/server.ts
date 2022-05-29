import express from 'express';
import bodyParser from "body-parser";
import { MintKit } from '../index';

const app = express();
app.use(bodyParser.json())

/* Mint */
const mint = new MintKit(app);

mint.build({
  entity: 'book',
  select: ['id', 'name']
});

mint.build({
  entity: 'people',
  select: ['id', 'age']
});

/* Start */
app.listen(3000, () => {
  console.log('Server running on port 3000');
})