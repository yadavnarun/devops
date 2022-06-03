import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@ApiTags('action')
@Controller('action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  // to create a new action
  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Create an action',
  })
  @ApiBody({
    description: 'Create an action',
    type: CreateActionDto,
  })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        action: { type: 'string' },
        content: { type: 'string' },
      },
    },
    description: 'The action has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  create(@Body() createActionDto: CreateActionDto) {
    return this.actionService.create(createActionDto);
  }

  // to get all actions
  @Get()
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'get all actions',
  })
  @ApiOkResponse({
    description: 'List of all actions',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  findAll() {
    return this.actionService.findAll();
  }

  // to get action with ID
  @Get(':id')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'get action with ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The action id',
    type: String,
    example: '100',
  })
  @ApiOkResponse({
    description: 'return action with given ID',
  })
  @ApiNotFoundResponse({
    description: 'No action found with given ID',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  findOne(@Param('id') id: string) {
    return this.actionService.findOne(+id);
  }

  // to patch action with ID
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'patch action with ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The action id',
    type: String,
    example: '100',
  })
  @ApiOkResponse({
    description: 'patched action with given ID',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  update(@Param('id') id: string, @Body() updateActionDto: UpdateActionDto) {
    return this.actionService.update(+id, updateActionDto);
  }

  // to delete action with ID
  @Delete(':id')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'delete action with ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The action id',
    type: String,
    example: '100',
  })
  @ApiOkResponse({
    description: 'deleted action with given ID',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  remove(@Param('id') id: string) {
    return this.actionService.remove(+id);
  }
}
