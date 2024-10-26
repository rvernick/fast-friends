import { Repository } from "typeorm";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { sendEmail } from "../utils/utils";
import { MaintenanceItem } from "./maintenance-item.entity";
import { Notification, NotificationStatus } from "./notification";
import { StravaService } from "./strava.service";
import { BatchProcessService } from "../batch/batch-process.service";
import { BatchProcess } from "../batch/batch-process.entity";

const last_run_maintenance = "MaintenanceChecker";
const twelve_hours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

export class MaintenanceChecker {
  private stravaService: StravaService;
  private userService: UserService;
  private notificationRepository: Repository<Notification>;
  private batchProcessService: BatchProcessService;
  
  constructor(theStravaService: StravaService,
      userService: UserService,
      notificationRepository: Repository<Notification>,
      lastRunService: BatchProcessService) {
    this.stravaService = theStravaService;
    this.userService = userService;
    this.notificationRepository = notificationRepository;
    this.batchProcessService = lastRunService;
  }

  isReady() {
    return this.stravaService != null
      && this.userService != null
      && this.notificationRepository != null
      && this.batchProcessService != null;
  }

  async runChecks() {
    var lockedBatchProcess: BatchProcess;
    try {
      lockedBatchProcess = await this.attemptToLockBatchProcess();
      if (lockedBatchProcess) {
        console.log('Running maintenance checks...');
        this.doChecks();
        this.finish(lockedBatchProcess);
      } 
    } catch (error) {
      console.error('Error running maintenance checks:', error);
    } finally {
      if (lockedBatchProcess) {
        this.unlock(lockedBatchProcess);
      }
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
            msg = msg + `${bike.name} - ${item.part} ${item.action} - miles: ${milesString} - ${item.brand} ${item.model} \n`;
          } else {
            msg = msg + `${bike.name} - ${item.part} ${item.action} - ${item.brand} ${item.model} \n`;
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
        if (bike.odometerMeters >= item.dueDistanceMeters && !item.wasNotified) {
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

  private async attemptToLockBatchProcess(): Promise<BatchProcess> {
    const lastRun = await this.batchProcessService.findByName(last_run_maintenance);
    if (this.shouldRunChecks(lastRun)) {
      console.log('Attempting to lock maintenance checks...');
      const lockedBatchProcess = await this.batchProcessService.attemptToLock(lastRun);
      if (lockedBatchProcess) {
        console.log('Maintenance checks locked');
        return lastRun;
      }
    }
    return null;
  }

  private shouldRunChecks(batchProcess: BatchProcess): boolean {
  //  console.log('Checking if maintenance checks should run...' + JSON.stringify(batchProcess) + '\n');
    if (batchProcess.lockedKey != null) {
      return this.isOverdue(batchProcess.lockedOn);
    }
    return this.isOverdue(batchProcess.lastRan);
  }

  private isOverdue(referenceDate: Date): boolean {
    if (!referenceDate) return true;  // No last run, always overdue
    const deadline = new Date().getTime() - twelve_hours;
    return referenceDate.getTime() < deadline;
  }

  private async finish(batchProcess: BatchProcess) {
    await this.batchProcessService.finish(batchProcess);
  }

  private async unlock(batchProcess: BatchProcess) {
    this.batchProcessService.unlock(batchProcess)
  }

}
