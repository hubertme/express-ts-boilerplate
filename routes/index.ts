import {Router} from "express";
const indexRouter: Router = Router();

/* GET home page. */
indexRouter.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

export default indexRouter;
