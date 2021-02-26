import {Router} from "express";
import AppConfig from "../../app_config";
import IndexBiz from "./index_biz";
import ServerResponse from "../../responses/server_response";
import ValidatorUtil from "../../utils/validator_util";
import {allowOptions} from "../../middlewares/allow_options";
import {logRequest} from "../../middlewares/request_logging";
import FormatterUtil from "../../utils/formatter_util";

const indexRouter: Router = Router();
indexRouter.use(allowOptions);
indexRouter.use(logRequest);

/* GET home page. */
indexRouter.get('/', (req, res, next) => {
  res.render('index', { title: `Express - ${FormatterUtil.getOfficialEnvName()}` });
});

indexRouter.post('/test/add', (req, res, next) => {
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
