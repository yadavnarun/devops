import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Action } from './entities/action.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private actionRepository: Repository<Action>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(createActionDto: CreateActionDto) {
    return await this.actionRepository
      .save(createActionDto)
      .then(async (res) => {
        await this.cacheManager.del('actions');
        return res;
      })
      .catch((err) => {
        console.error(err);
        if (err.errno === 19)
          throw new BadRequestException('Action already exists');
        else throw new InternalServerErrorException('Error creating action');
      });
  }

  async findAll() {
    const cache = await this.cacheManager.get('actions');
    if (cache !== null) return cache;

    return await this.actionRepository
      .find()
      .then(async (res) => {
        await this.cacheManager.set('actions', res);
        return res;
      })
      .catch((err) => {
        console.error(err);
        throw new InternalServerErrorException('Error finding actions');
      });
  }

  async findOne(id: number) {
    return await this.actionRepository
      .findOne({ where: { id } })
      .then((res) => {
        if (res !== null) return res;
        else throw new Error('bad');
      })
      .catch((err) => {
        if (err.message === 'bad')
          throw new NotFoundException('No action found with given ID');
        else {
          console.error(err);
          throw new InternalServerErrorException('Error finding action');
        }
      });
  }

  async update(id: number, updateActionDto: UpdateActionDto) {
    return await this.actionRepository
      .update(id, updateActionDto)
      .then(async (res) => {
        if (res.affected === 1) {
          await this.cacheManager.del('actions');
          return res;
        } else throw new Error('bad');
      })
      .catch((err) => {
        if (err.message === 'bad')
          throw new BadRequestException('No action found with given ID');
        else {
          console.error(err);
          throw new InternalServerErrorException('Error updating action');
        }
      });
  }

  async remove(id: number) {
    return await this.actionRepository
      .delete(id)
      .then(async (res) => {
        if (res.affected === 1) {
          await this.cacheManager.del('actions');
          return res;
        } else throw new Error('bad');
      })
      .catch((err) => {
        if (err.message === 'bad')
          throw new BadRequestException('No action found with given ID');
        else {
          console.error(err);
          throw new InternalServerErrorException('Error removing action');
        }
      });
  }
}
