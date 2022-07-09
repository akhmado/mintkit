# Mintkit

Mintkit is a set of tools to increase your developing and prototyping speed, In case you have an idea and you want to test it, Mintkit gets you covered.
Mintkit generates a CRUD endpoint for each of your Prisma tables and adds **body validation** (optional) from types extracted from the model itself, in case you need **file upload** Mintkit can handle that too out of the box, You need to manage the data through UI Mintkit comes with an **admin panel** (soon to be available) through which you can manage all your tables visually, Mintkit is thought of as an additional tool which can be embedded into your existing or newly created express project an not fully-fledged framework (at least for now)

Currently Mintkit only supports **Prisma** as its ORM and runs using **express** (list of supported orm`s and HTTP frameworks will be extended in the future).

Mintkit still in a very early stages of development so expect it to crash from time to time :)


# Installation

To install Mintkit using npm run:
```npm install mintkit```

Using yarn
```yarn add mintkit```

# Initializing Mintkit 

To get you going you have to initialize a Mintkit instance that is where all of the functionality will come from, you have to pass **express app** as the first argument to the Mintkit

```
import express from "express";
import bodyParser from "body-parser";
import {MintKit} from "mintkit";

const app = express();
app.use(bodyParser.json());

const kit = new MintKit(app);
```

You could also pass a configuration object as a second argument to the Mintkit instance.

```
const config = {
	apiPrefix: string,
	filesConfig?: {
		folderLocation: string,
		servingURL: string,
	}
}
```

```markdown
| Key            | Value                                                                                                                      |
|----------------|----------------------------------------------------------------------------------------------------------------------------|
| apiPrefix      | a URL prefix to the all CRUD endpoints (you could add an API prefix for example and all endpoint will be served from /api/ |
| filesConfig    | an optional configuration object in case you want to add file upload/serving functionality                                 |
| folderLocation | an absolute path to the folder where all the static files will be stored and served from                                        |
| servingURL     | a URL prefix to the URL from which static files will be served, does not get affected by apiPrefix     
```



# CRUD functionality

To enable CRUD functionality to a specific table use the view method provided on the kit instance:
```
kit.view({ entity: 'Book' })
```

And that is it, now you have full CRUD available to the Book table, you can access it through **/{entity}** or **/book** for this example:

- GET many through: host://book
- GET one by id through: host://book/:id
- UPDATE one by id through (POST or PUT): host://book/:id
- DELETE one by id through: host://book/:id

In case you want the table to be served through a different name, you can use **path** property on the view method, here is a small example of how to do it:

```
kit.view({
	entity: 'Book',
	path: 'my-books'
})
```

Now book table served through **/my-books**  instead of /book

#### Controlling enabled methods:
Controlling which methods are enabled, there is a second property the view method which is called **methods** is an object of all possible CRUD methods.

```
kit.view({
	entity: string,
	methods?: {
		findOne?: boolean,
		findMany?: boolean,
		delete?: boolean,
		update?: boolean,
		create?: boolea
	}
})
```

In some cases you only want to serve data and not add other methods like create/update/delete, here is an example of how to do it:
```
kit.view({
	entity: 'Book',
	methods: {
		findOne: true,
		findMany: true,
	}
})
```

####  Selecting which columns to be served
Sometimes we face a situation where we want only selected columns from a table to be served in this case view method has another property called **select**,  select is a string array of column names, here is a small example of how to do it:

```
kit.view({
	entity: 'Book',
	select: ['name', 'price']
})
```

#### Body validation
View by default has validation **enabled**,  it is clunky and very early so sometimes you may want to disable it :),view method has a **validation object**, here is an example:
```
kit.view({
	entity: 'Book',
	validation: { enabled: false }
})
```
Mintkit uses **ajv** for validation you can pass your own configuration to override auto-generated validation configuration like (soon to be available):
```
kit.view({
	entity: 'Book',
	validation: {
	enabled: true,
	validationSchema: {//schema}
})
```


####  Notes:
- Entity is the Prisma model name, keep in mind it is **case sensitive.** 
- Body validation only supports basic types like numbers, strings and floats **(more types to be supported soon)**
- In case you have apiPrefix set up in the configuration object it will affect the path: **host://{apiPrefix}/{path || entity}/:id?**


## File upload and file serving

Pretty common for some data to have a file attached to it, like an image for example, and we want to save it and later on serve it,Mintkit can handle this process, how does it work and what do you need?

You have a specific cell in a table where a path to the file will be stored, a path to a folder where the file will be stored, and a key in a body where the file is located, here is a small example of how to achieve a file upload.
First, we have to extend our configuration object with two more properties in an object called **filesConfig**, first is a folderLocation which takes an **absolute path** to the folder where files will be saved, the second property is **servingURL** and this is the URL through which images can be retrieved from, here is a small example of extending configuration object with necessary properties:
```
import express from "express"; 
import bodyParser from "body-parser"; 
import {MintKit} from "mintkit"; 

const app = express(); 
app.use(bodyParser.urlencoded({ extended: true }));

const kit = new MintKit(app, {
	apiPrefix: 'api',
	filesConfig: {
		folderLocation: '/path/to/folder/images',
		servingURL: 'images'
	}
});
```
The second step is to specify on the view method itself from which key from the body should Mintkit expect a file, and to which cell in a table should the path to file be saved, for that we can pass an additional object to the view called **files** with its two properties, first **fileName** and it is the name of the key in a body/formData that holds the file and the second is **fileTableCell** is the name of a column in your database table where the path to the file should be saved in, here is a small example:
```
kit.view({
	entity: 'Book',
	files: {
		fileName: 'bookImage',
		fileTableCell: 'image'
	}
})
```

#### Here is full example of a file upload setup for a hypothetical *Book* model:
```
import express from "express";
import bodyParser from "body-parser";
import {MintKit} from "mintkit";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const kit = new  MintKit(app, {
	apiPrefix: 'api',
	filesConfig: {
		folderLocation: '/location/to/folder/images',
		servingURL: 'images'
	}
});

kit.view({
	entity: 'Book',
	files: {
		fileName: 'bookImage',
		fileTableCell: 'image'
	}
})
```

#### Notes
- If the **fileName** and the **fileTableCell** match there is no need to pass fileTableCell, the view will use fileName as a replacement if no fileTableCell was provided.


## Issues
Feel free to mention any issue in the issue section of the Mintkit Github page, or simply follow the link: https://github.com/akhmado/mintkit/issues

## Contribution
In case you like the project and want to contribute to its growth and its future be free to open a pull request with a brief description of functionality, improvements, or bugfixes, and **Thanks in advance :)**