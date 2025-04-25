import { post } from "@/common/http-utils";
import { ensureString } from "@/common/utils";
import { MaintenanceLog } from "@/models/MaintenanceLog";


export const updateOrCreateMaintenanceItems = async (session: any, selectedItems: MaintenanceLog[]): Promise<string> =>{
  var response = "";
  try {
    for (const item of selectedItems) {
      if (await updateOrAddMaintenanceItem(
        session,
        session.email,
        item.maintenanceItem.id,
        item.bikeId,
        item.maintenanceItem.part,
        item.maintenanceItem.action,
        item.maintenanceItem.defaultLongevity ? item.maintenanceItem.dueDistanceMeters : null,
        item.maintenanceItem.defaultLongevityDays ? item.maintenanceItem.dueDate : null,
        "", // brand,
        "", // model,
        "", // link,
        item.maintenanceItem.defaultLongevity,
        item.maintenanceItem.defaultLongevityDays,
        true)) {
          console.log('Created maintenance item'+ item.maintenanceItem.part + '-'+ item.maintenanceItem.action);
      } else {
        console.log('Failed creating maintenance item: '+ item.maintenanceItem.part + '-'+ item.maintenanceItem.action);
        response += 'Failed to create maintenance item'+ item.maintenanceItem.part + '-'+ item.maintenanceItem.action + '\n';
      }
    }
    return response;
  } catch(e: any) {
    console.log(e.message);
    return e.message;
  }
}

export const updateOrAddMaintenanceItem = async (
        session: any,
        username: string,
        maintenanceItemId: number,
        bikeId: number,
        part: string,
        action: string,
        dueMiles: number | null,
        dueDate: Date | null,
        brand: string,
        model: string,
        link: string,
        defaultLongevity: number,
        defaultLongevityDays: number,
        autoAdjustLongevity: boolean,
      ) => {

      if (session === null) {
        console.log('get maintenanceItem has no context: ' + username);
        return Promise.resolve(false);
      }
      const jwtToken = session.jwt_token;
      if (jwtToken == null) {
        console.log('get bikes has no token dying: ' + username);
        return Promise.resolve(false);
      }

      try {
        const parameters = {
          username: username,
          id: maintenanceItemId,
          bikeid: bikeId,
          part: ensureString(part),
          action: ensureString(action),
          duemiles: dueMiles ? dueMiles : 0,
          duedate: dueDate ? dueDate.getTime() : 0,
          brand: ensureString(brand),
          model: ensureString(model),
          maintenanceid: maintenanceItemId,
          link: ensureString(link),
          defaultLongevity: defaultLongevity,
          defaultLongevityDays: defaultLongevityDays,
          autoAdjustLongevity: autoAdjustLongevity,
        };
        console.log('update maintenanceItem ' + maintenanceItemId);
        console.log('/bike/update-or-add-maintenance-item', JSON.stringify(parameters));
        const response = await post('/bike/update-or-add-maintenance-item', parameters, jwtToken);
        return response.ok;
      } catch(e: any) {
        console.log(e.message);
        return Promise.resolve(false);
      }
    }
    