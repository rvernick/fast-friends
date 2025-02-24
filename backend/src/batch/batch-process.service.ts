import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BatchProcess } from "./batch-process.entity";

@Injectable()
export class BatchProcessService {
  private readonly logger = new Logger(BatchProcessService.name);

  constructor(
    @InjectRepository(BatchProcess)
    private readonly batchProcessRepository: Repository<BatchProcess>,
  ) {}

  async findByName(name: string) {
    var result = await this.batchProcessRepository.findOne({
      where: {
        name: name,
      },
    });
    if (result === null) {
      result = await this.batchProcessRepository.create();
      result.name = name;
    }
    return result;
  };

  async attemptLockOn(lockName: string): Promise<BatchProcess> {
    const batchProcess = await this.findByName(lockName);
    return this.attemptToLock(batchProcess);
  }

  async attemptToLock(batchProcess: BatchProcess): Promise<BatchProcess> {
    try {
      const wasLocked = await this.findByName(batchProcess.name);
      if (wasLocked.lockedKey == null) {
        batchProcess.lockedKey = Math.random().toString(36).substr(2, 10);
        batchProcess.lockedOn = new Date();
        this.logger.log('Locked batch process');
        await this.batchProcessRepository.save(batchProcess);
        const lockedConfirmation = await this.findByName(batchProcess.name);
        if (lockedConfirmation.lockedKey === batchProcess.lockedKey) {
          this.logger.log('Locked batch process successfully');
          return lockedConfirmation;
        } else {
          this.logger.error('Locked batch process key mismatch');
          return null;
        }
      } else {
        if (this.hasBeenLockedForTooLong(wasLocked)) {
          this.unlock(batchProcess);
        }
      }
    } catch (error) {
      this.logger.log('Error locking batch process name: ', error);
      return null;
    }
  }

  private hasBeenLockedForTooLong(batchProcess: BatchProcess): boolean {
    const lockDuration = 12 * 60 * 60 * 1000 ; // 12 hours
    const lockAge = new Date().getTime() - batchProcess.lockedOn.getTime();
    return lockAge > lockDuration;
  }

  async finish(batchProcess: BatchProcess) {
    try {
      const id = batchProcess.id;
      const currentBatchProcess = await this.batchProcessRepository.findOneBy({ id });
      currentBatchProcess.lockedKey = null;
      currentBatchProcess.lockedOn = null;
      currentBatchProcess.lastRan = new Date();
      this.logger.log('Finished batch process ' + JSON.stringify(batchProcess));
      this.batchProcessRepository.save(currentBatchProcess);
    } catch (error) {
      this.logger.log('Error finishing batch process name: ', batchProcess.name);
      this.logger.log('Error finishing batch process key: ', batchProcess.lockedKey);
      this.logger.log('Error finishing batch process date: ', batchProcess.lockedOn);
      this.logger.error('Error finishing batch process: ', error);
    }
  }

  async unlock(batchProcess: BatchProcess) {
    if (batchProcess == null) return;
    try {
      const id = batchProcess.id;
      const currentBatchProcess = await this.batchProcessRepository.findOneBy({ id });
      currentBatchProcess.lockedKey = null;
      currentBatchProcess.lockedOn = null;
      await this.batchProcessRepository.save(batchProcess);
      this.logger.log('Unlocked batch process ' + JSON.stringify(batchProcess));
    } catch (error) {
      this.logger.log('Error finishing batch process name: ', batchProcess.name);
      this.logger.log('Error finishing batch process key: ', batchProcess.lockedKey);
      this.logger.log('Error finishing batch process date: ', batchProcess.lockedOn);
      this.logger.error('Error finishing batch process: ', error);
    }
  }
}