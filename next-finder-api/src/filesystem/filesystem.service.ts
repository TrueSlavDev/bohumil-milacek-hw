import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as fsPath from 'path';
@Injectable()
export class FilesystemService {
  constructor() {}

  getDirectory(path: string) {
    path = decodeURIComponent(path);
    const homedirPath = '.'
    const requestedPath = fsPath.join(homedirPath, path);

    const files: { path: string; type: string }[] = [];

    if (!fs.existsSync(requestedPath)) {
      throw new NotFoundException('Path does not exist');
    }

    for (const filePath of fs.readdirSync(requestedPath)) {
      const filePathFull = fsPath.join(requestedPath, filePath);
      // get file info
      try {
        const fileStats = fs.lstatSync(filePathFull);
        files.push({
          path: filePath,
          type: fileStats.isDirectory()
            ? 'directory'
            : fileStats.isFile()
              ? 'file'
              : 'unknown',
        });
      } catch (error) {}
    }
    return files;
  }
}
