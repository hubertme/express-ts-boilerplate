import {Router} from "express";
import AppConfig from "../../app_config";
const indexRouter: Router = Router();

/* GET home page. */
indexRouter.get('/', (req, res) => {
  res.render('index', { title: `Express - ${AppConfig.IS_PRODUCTION ? 'Production' : 'Development'}` });
});

export default indexRouter;
