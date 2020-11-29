import {Router} from "express";
import AppConfig from "../../app_config";
import IndexBiz from "./index_biz";
import ServerResponse from "../../responses/server_response";
import ValidatorUtil from "../../utils/validator_util";
const indexRouter: Router = Router();

/* GET home page. */
indexRouter.get('/', (req, res, next) => {
  res.render('index', { title: `Express - ${AppConfig.IS_PRODUCTION ? 'Production' : 'Development'}` });
});

indexRouter.post('/addTest', (req, res, next) => {
  const {a ,b} = req.body;
  const validator = {
    "a": "number",
    "b": "number"
  };

  if (!ValidatorUtil.isValidPayload(req.body, validator)) {
    res.status(500).json(
        ServerResponse.ValidationError(),
    );
    return;
  }

  const sum = IndexBiz.sumTwoDigits(a,b);
  res.status(200).json(
      ServerResponse.Success(sum),
  );
})

export default indexRouter;
