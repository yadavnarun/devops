import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Action } from './entities/action.entity';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private actionRepository: Repository<Action>,
  ) {}

  async create(createActionDto: CreateActionDto) {
    return await this.actionRepository
      .save(createActionDto)
      .then((res) => {
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
    return await this.actionRepository
      .find()
      .then((res) => {
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
      .then((res) => {
        if (res.affected === 1) return res;
        else throw new Error('bad');
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
      .then((res) => {
        if (res.affected === 1) return res;
        else throw new Error('bad');
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
