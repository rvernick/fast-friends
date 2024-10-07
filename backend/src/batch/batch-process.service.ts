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

  async attemptToLock(batchProcess: BatchProcess): Promise<BatchProcess> {
    try {
      batchProcess.lockedKey = Math.random().toString(36).substr(2, 10);
      batchProcess.lockedOn = new Date();
      this.logger.log('Locked batch process'+ JSON.stringify(batchProcess));
      await this.batchProcessRepository.save(batchProcess);
      return batchProcess;
    } catch (error) {
      this.logger.log('Error locking batch process name: ', error);
      return null;
    }
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