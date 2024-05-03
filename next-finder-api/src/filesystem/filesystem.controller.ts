import { Controller, Get, Query } from '@nestjs/common';

import { FilesystemService } from './filesystem.service';
import { GetDirecotryQuery } from './query/get-directory.query';

@Controller('directory')
export class FilesystemController {
  constructor(private readonly filesystemService: FilesystemService) {}

  @Get()
  async getDirecotry(@Query() getDirecotryQuery: GetDirecotryQuery) {
    return await this.filesystemService.getDirectory(getDirecotryQuery.path);
  }
}
