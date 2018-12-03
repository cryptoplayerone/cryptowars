import {Entity, model, property, hasMany} from '@loopback/repository';
import {Move} from './move.model';

@model()
export class Game extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @property({
    type: 'number',
    default: 5 * 60 * 1000,
  })
  gameTime: number;

  @property({
    type: 'number',
    default: 5 * 60 * 1000,
  })
  resolveTime: number;

  @property({
    type: 'date',
    generated: true,
    default: new Date(),
  })
  startTime: Date;

  @property({
    type: 'string',
  })
  move: string;

  @property({
    type: 'number',
  })
  amount: number;

  @property({
    type: 'number',
  })
  players: number;

  @hasMany(() => Move, {keyTo: 'gameId'})
  moves?: Move[];

  constructor(data?: Partial<Game>) {
    super(data);
  }
}
