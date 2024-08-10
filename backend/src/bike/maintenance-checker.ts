import { Repository } from "typeorm";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { sendEmail } from "../utils/utils";
import { MaintenanceItem } from "./maintenance-item.entity";
import { Notification, NotificationStatus } from "./notification";
import { StravaService } from "./strava.service";


export class MaintenanceChecker {
  private stravaService: StravaService;
  private userService: UserService;
  private notificationRepository: Repository<Notification>;
  
  constructor(theStravaService: StravaService, userService: UserService, notificationRepository: Repository<Notification>) {
    this.stravaService = theStravaService;
    this.userService = userService;
    this.notificationRepository = notificationRepository;
  }

  async runChecks() {
    try {
      console.log('Running maintenance checks...');
      if (this.shouldRunChecks()) {
        console.log('Maintenance checks are enabled');
        this.doChecks();
    }
    } catch (error) {
      console.error('Error running maintenance checks:', error);
    }
  }

  private async doChecks() {
    const userIds = await this.userService.getUserIdsWithStravaLinked();
    for (const userId of userIds) {
      const user = await this.userService.findOne(userId);
      await this.checkBikeMaintenance(user);
    }
  }

  private async checkBikeMaintenance(user: User) {
    await this.performMaintenanceChecks(user);
  }

  private performMaintenanceChecks(user: User) {
    console.log('Checking maintenance for bike '+ user.username);
    this.updateOdometers(user);
    const overdueMaintenanceItems = this.getOverdueMaintenanceItems(user);
    if (overdueMaintenanceItems.length > 0) {
      this.sendNotification(user, overdueMaintenanceItems);
    }
  }

  private sendNotification(user: User, overdueMaintenanceItems: MaintenanceItem[]) {
    const body = this.createNotificationBody(user, overdueMaintenanceItems);
    const notification = new Notification(user, 'Overdue Maintenance Items', overdueMaintenanceItems);
    if (sendEmail(user.username, 'Overdue Maintenance Items', body)) {
      notification.status = NotificationStatus.SENT;
    } else {
      notification.status = NotificationStatus.FAILED;
    }
    this.notificationRepository.save(notification);
  }

  createNotificationBody(user: User, overdueMaintenanceItems: MaintenanceItem[]): string {
    var msg = 'Dear ${user.firstName},\n\nYou have some maintenance needed on your bikes';
    msg = msg + 'Based on our records, you should check the following maintenance items:\n\n';

    // TODO: create deep link to the maintenance item
    user.bikes.forEach((bike) => {
      const maintenanceItems = bike.maintenanceItems;
      for (const item of maintenanceItems) {
        if (overdueMaintenanceItems.some((overdueItem) => overdueItem.id === item.id)) {
          if (item.lastPerformedDistanceMeters !== null && item.lastPerformedDistanceMeters > 0) {
            const meters = bike.odometerMeters - item.lastPerformedDistanceMeters;
            const miles = meters / 1609.34;
            const milesString = miles.toFixed(0);
            msg = msg + `${bike.name} - ${item.part} - miles: ${milesString} - ${item.brand} ${item.model} \n`;
          } else {
            msg = msg + `${bike.name} - ${item.part} - ${item.brand} ${item.model} \n`;
          }
        }
      }
    });
    return msg
  }

  private getOverdueMaintenanceItems(user: User): MaintenanceItem[] {
    const result = [];
    for (const bike of user.bikes) {
      const maintenanceItems = bike.maintenanceItems;
      for (const item of maintenanceItems) {
        if (bike.odometerMeters >= item.dueDistanceMeters && !item.completed) {
          // TODO: should exclude items that have recent notifications
          result.push(item);
        }
      }
    }
    return result;
  }

  private updateOdometers(user: User) {
    // TODO: Update the whole athlete, not just the bikes
    this.stravaService.updateBikes(user);
  }

  private shouldRunChecks(): boolean {
    return true; // TODO: Implement this logic.  
                 // Relying on only running when a user named "strava" has logged in.
  }

  private checksNeedRunning(): boolean {
    // should track last run time and check if it's been more than 1 day
    // could also check if any bikes have not been updated in the last 24 hours
    return false; // TODO: Implement this logic
  }
}