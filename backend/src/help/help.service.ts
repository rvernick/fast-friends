import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { Repository } from "typeorm";
import { HelpRequestDto } from "./help-request.dto";
import { getNeedTypeFor, HelpRequest } from "./help-request.entity";
import { UserService } from "../user/user.service";
import { getPartFor } from "../bike/part";
import { getActionFor } from "../bike/action";


@Injectable()
export class HelpService {
  private readonly logger = new Logger(HelpService.name);

  constructor(
    @InjectRepository(HelpRequest)
    private helpRequestRepository: Repository<HelpRequest>,
    @Inject(UserService)
    private userService: UserService,

  ) {}


  async getRecentOpenHelpRequests(limit: number): Promise<HelpRequest[] | null> {
    const queryBuilder = this.helpRequestRepository.createQueryBuilder("helpRequest");
    queryBuilder.where("helpRequest.resolved = false");
    queryBuilder.orderBy("helpRequest.createdOn", "DESC");
    queryBuilder.limit(limit);
    return this.helpRequestRepository.find();;
  }

  async addOrUpdate(helpRequestDto: HelpRequestDto): Promise<HelpRequest | null> {
    try {
      this.logger.log('Updating or adding bike: ', helpRequestDto);
      const user = await this.userService.findUsername(helpRequestDto.username);
      if (user == null) {
        this.logger.log('User not found: ', helpRequestDto.username);
        return null;
      }
      const id = helpRequestDto.id;
      var request: HelpRequest;
      if (id == 0) {
        request = this.helpRequestRepository.create();
      } else {
        request = await this.helpRequestRepository.findOneBy({ id });
        if (request == null) {
          this.logger.log('Bike not found: ', id);
          return null;
        }
      }
      request.user = user;
      request.part = getPartFor(helpRequestDto.part);
      request.action = getActionFor(helpRequestDto.action);
      request.needType = getNeedTypeFor(helpRequestDto.needType);
      request.description = helpRequestDto.description;
      request.resolved = helpRequestDto.resolved;

      this.helpRequestRepository.save(request);
    } catch (error) {
      console.error('Error updating or adding help request: ', error);
      return null;
    }
  }

}