/* eslint-disable @typescript-eslint/no-unused-vars */
import { ItemsModule } from './items.module';
import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Item, ItemsDocument } from './schema/items.schema';
import { Model } from 'mongoose';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemsModule: Model<ItemsDocument>,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const itemCreated = await this.itemsModule.create(createItemDto);
    return itemCreated;
  }

  async findAll() {
    const items = await this.itemsModule.find().exec();
    return items;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
