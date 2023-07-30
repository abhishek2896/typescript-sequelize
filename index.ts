import express, { Application, NextFunction, Request, Response } from 'express';
import { UserRoutes } from './src/routes';
import dbInit from './src/config/db';
import config from './src/config/config';


const app: Application = express();

const port: string = config.port;


// parse requests of content-type - application/json
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// initialize db
if (config.env !== 'test') dbInit()

//CORS middleware
app.use(function(req: Request, res: Response, next: NextFunction) {
  // var origin = req.get('origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  // res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override,Authorization, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});


// routes
app.use('/users', UserRoutes)


app.listen(port, () => {
    console.info(`Server running on port ${port}`)
})

export default app;