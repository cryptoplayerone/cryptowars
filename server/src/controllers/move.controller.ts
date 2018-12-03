import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  del,
  requestBody,
} from '@loopback/rest';
import {Move} from '../models';
import {MoveRepository} from '../repositories';

export class MoveController {
  constructor(
    @repository(MoveRepository)
    public moveRepository : MoveRepository,
  ) {}

  @post('/move', {
    responses: {
      '200': {
        description: 'Move model instance',
        content: {'application/json': {schema: {'x-ts-type': Move}}},
      },
    },
  })
  async create(@requestBody() move: Move): Promise<Move> {
    return await this.moveRepository.create(move);
  }

  @get('/move/count', {
    responses: {
      '200': {
        description: 'Move model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Move)) where?: Where,
  ): Promise<Count> {
    return await this.moveRepository.count(where);
  }

  @get('/move', {
    responses: {
      '200': {
        description: 'Array of Move model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Move}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Move)) filter?: Filter,
  ): Promise<Move[]> {
    return await this.moveRepository.find(filter);
  }

  @patch('/move', {
    responses: {
      '200': {
        description: 'Move PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() move: Move,
    @param.query.object('where', getWhereSchemaFor(Move)) where?: Where,
  ): Promise<Count> {
    return await this.moveRepository.updateAll(move, where);
  }

  @get('/move/{id}', {
    responses: {
      '200': {
        description: 'Move model instance',
        content: {'application/json': {schema: {'x-ts-type': Move}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Move> {
    return await this.moveRepository.findById(id);
  }

  @patch('/move/{id}', {
    responses: {
      '204': {
        description: 'Move PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() move: Move,
  ): Promise<void> {
    await this.moveRepository.updateById(id, move);
  }

  @del('/move/{id}', {
    responses: {
      '204': {
        description: 'Move DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.moveRepository.deleteById(id);
  }
}
