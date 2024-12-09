import AppContext from "@/common/app-context";
import AppController from "@/common/AppController";
import { getInternal, isLoggedIn, post } from "@/common/http-utils";
import { HelpRequest } from "@/models/HelpRequest";

class HelpRequestController extends AppController {
  constructor(appContext: AppContext) {
    super(appContext);
  }

  updateOrAddHelpRequest = async (session: any,
        id: number,
        username: string,
        partOption: string,
        actionOption: string,
        needType: string,
        description: string,
        resolved: boolean): Promise<HelpRequest | null> => {


    if (!isLoggedIn(session)) {
      return Promise.resolve(null);
    }

    const parameters = {
      id: id,
      username: username,
      part: partOption,
      action: actionOption,
      needType: needType,
      description: description,
      resolved: resolved,
    };
    const result = await post('/help/update-or-add-help-request', parameters, await session.jwt_token);
    if (result.ok) {
      return result.json();
    }
    console.log('error: '+ result.statusText);
    return null;    
  }

  getHelpRequest = async (session: any, id: number): Promise<HelpRequest | null> => {
    if (!isLoggedIn(session)) {
      return Promise.resolve(null);
    }

    try {
      const parameters = {
        id: id,
      };
      console.log('get request');
      return getInternal('/help/request', parameters, await session.jwt_token);
    } catch(e: any) {
      console.log(e.message);
      return Promise.resolve(null);
    }
    return Promise.resolve(null);
  };

  addComment = async (session: any, id: number, username: string, comment: string): Promise<HelpRequest | null> => {
    if (!isLoggedIn(session)) {
      return Promise.resolve(null);
    }

    const parameters = {
      id: id,
      username: username,
      comment: comment,
    };
    const result = await post('/help/add-comment', parameters, await session.jwt_token);
    if (result.ok) {
      return result.json();
    }
    return null;
  };

}

export default HelpRequestController;
