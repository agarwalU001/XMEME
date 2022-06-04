/**
 * Express - Web Application Framework for Nodejs
 * CORS - Cross Origin Resource Sharing  -> used to make request from one website to another from the browser
 * lowdb - lowdb is a small local JSON database
 * swaggerUI - it is used to render documentation for an API defined with the OpenAPI (Swagger) Specification
 * swaggerJsDoc - it read jsDoc anotated source code and converts into OpenAPI (Swagger) Specification
 */

const express = require('express');
const cors = require('cors');
const lowDb = require('lowdb');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const memesRouter = require('./routes/memes');

/**
 * Using FileSync adaptor from lowdb which process operations syncronously
 * and then iniliazing the adaptor to use the local json file and then initializing
 * the database with the adaptor
 */
const FileSync = require('lowdb/adapters/FileSync');
const adaptor = new FileSync('db.json');
const db = lowDb(adaptor);

//Setting memes array as default for CRUD operations
db.defaults({ memes: [] }).write();

/**
 * The option here provides basic information about the API for swaggerUI like title
 * and description etc also the path to the file where all our apis are mentioned
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'XMEME API',
      description: 'Swagger UI Documentation for XMEME API',
      version: '1.0.0',
      title: 'XMeme API',
      contact: {
        email: 'agarwalutkarsh001@gmail.com',
      },
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);

//Initializing express app
const app = express();

//this helps us to access the db directly using app.db
app.db = db;

/**
 * As we want our index.html (static file) to be rendered we are using express.static which help
 * us render static files .
 * using swaggerUI for rendering swagger as an UI.
 * cors for cross origin resource sharing.
 * express.json is a body parser which parses response body to json.
 * memesRouter is  express Router which contains all the api with endpoint starting with /memes
 */
app.use(express.static('./'));
app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(specs));
app.use(cors());
app.use(express.json());
app.use('/memes', memesRouter);

//doing a get request to '/' endpoint and rendering our index.html page
app.get('/', (req, res) => {
  res.render('index.html');
});

//initializing port as either environment port number or 8081
const port = process.env.PORT || 8081;

//listening to port
app.listen(port);
