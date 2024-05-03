import { IsString } from 'class-validator';

export class GetDirecotryQuery {
  @IsString()
  path: string;
}
