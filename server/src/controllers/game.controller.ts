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
import {Game, Move} from '../models';
import {GameRepository} from '../repositories';
import {MoveController} from './move.controller';

export class GameController {
  constructor(
    @repository(GameRepository)
    public gameRepository : GameRepository,
  ) {}

  @post('/game', {
    responses: {
      '200': {
        description: 'Game model instance',
        content: {'application/json': {schema: {'x-ts-type': Game}}},
      },
    },
  })
  async create(@requestBody() game: Game): Promise<Game> {
    game.startTime = new Date();
    return await this.gameRepository.create(game);
  }

  @get('/game/count', {
    responses: {
      '200': {
        description: 'Game model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Game)) where?: Where,
  ): Promise<Count> {
    return await this.gameRepository.count(where);
  }

  @get('/game', {
    responses: {
      '200': {
        description: 'Array of Game model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Game}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Game)) filter?: Filter,
  ): Promise<Game[]> {
    return await this.gameRepository.find(filter);
  }

  @patch('/game', {
    responses: {
      '200': {
        description: 'Game PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() game: Game,
    @param.query.object('where', getWhereSchemaFor(Game)) where?: Where,
  ): Promise<Count> {
    return await this.gameRepository.updateAll(game, where);
  }

  @get('/game/{id}', {
    responses: {
      '200': {
        description: 'Game model instance',
        content: {'application/json': {schema: {'x-ts-type': Game}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Game> {
    return await this.gameRepository.findById(id);
  }

  @post('/game/{id}/move', {
    responses: {
      '200': {
        description: 'Game model instance',
        content: {'application/json': {schema: {'x-ts-type': Move}}},
      },
    },
  })
  async createMove(
    @param.path.string('id') id: string,
    @requestBody() move: Move,
  ): Promise<Move> {
    let moveController, game;

    moveController = new MoveController(await this.gameRepository.move);

    game = this.findById(id);
    if (!game) {
        throw new Error('No game found with this id.');
    }

    move.gameId = id;
    let count = await moveController.count();
    move.paymentIdentifier = count.count + 1;
    console.log('move', move);
    return await moveController.create(move);
  }

  @patch('/game/{id}', {
    responses: {
      '204': {
        description: 'Game PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() game: Game,
  ): Promise<void> {
    await this.gameRepository.updateById(id, game);
  }

  @del('/game/{id}', {
    responses: {
      '204': {
        description: 'Game DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.gameRepository.deleteById(id);
  }
}
