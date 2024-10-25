import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { getInternal } from "@/common/http-utils";
import { sleep } from "@/common/utils";
import { Bike } from "@/models/Bike";

class BikeListController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

}

export default BikeListController;
