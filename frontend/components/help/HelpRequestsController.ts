import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { getInternal } from "@/common/http-utils";
import { HelpRequest } from "@/models/HelpRequest";

class HelpRequestsController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  getRequests = async (session: any): Promise<HelpRequest[]> => {
    if (session === null) {
      console.log('get Requests has no context: ');
      return Promise.resolve([]);
    }
    const jwtToken = await session.jwt_token;
    if (jwtToken == null) {
      console.log('get requests has no token dying: ' );
      return Promise.resolve([]);
    }

    try {
      const parameters = {
        limit: 100,
      };
      console.log('get requests');
      return getInternal('/help/requests', parameters, jwtToken);
    } catch(e: any) {
      console.log(e.message);
      return [];
    }
  };

}

export default HelpRequestsController;
