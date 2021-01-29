/*
 * SPDX-FileCopyrightText: 2021 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Injectable } from '@nestjs/common';
import { ConsoleLoggerService } from '../logger/console-logger.service';
import { HistoryEntryUpdateDto } from './history-entry-update.dto';
import { HistoryEntryDto } from './history-entry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryEntry } from './history-entry.enity';
import { UsersService } from '../users/users.service';
import { NotesService } from '../notes/notes.service';

@Injectable()
export class HistoryService {
  constructor(
    private readonly logger: ConsoleLoggerService,
    @InjectRepository(HistoryEntry)
    private historyEntryRepository: Repository<HistoryEntry>,
    private usersService: UsersService,
    private notesService: NotesService,
  ) {
    this.logger.setContext(HistoryService.name);
  }

  async getUserHistory(userName: string): Promise<HistoryEntryDto[]> {
    //TODO: Use the database
    const user = await this.usersService.getUserByUsername(userName);
    const foundEntries = await this.historyEntryRepository.find({
      where: { user: user },
    });
    return Promise.all(
      foundEntries.map(async (entry) => await this.toHistoryEntryDto(entry)),
    );
  }

  async createNotExistingHistoryEntry(
    noteIdOrAlias: string,
    userName: string,
  ): Promise<HistoryEntry> {
    const user = await this.usersService.getUserByUsername(userName);
    const note = await this.notesService.getNoteByIdOrAlias(noteIdOrAlias);
    const entry = await this.historyEntryRepository.findOne({
      where: {
        note: note,
        user: user,
      },
    });
    if (entry) {
      // update timestamp
      return entry;
    }
    const historyEntry = HistoryEntry.create(user, note);
    return this.historyEntryRepository.save(historyEntry);
  }

  updateHistoryEntry(
    noteId: string,
    updateDto: HistoryEntryUpdateDto,
  ): HistoryEntryDto {
    //TODO: Use the database
    this.logger.warn('Using hardcoded data!');
    return {
      metadata: {
        alias: null,
        createTime: new Date(),
        description: 'Very descriptive text.',
        editedBy: [],
        id: 'foobar-barfoo',
        permissions: {
          owner: {
            displayName: 'foo',
            userName: 'fooUser',
            email: 'foo@example.com',
            photo: '',
          },
          sharedToUsers: [],
          sharedToGroups: [],
        },
        tags: [],
        title: 'Title!',
        updateTime: new Date(),
        updateUser: {
          displayName: 'foo',
          userName: 'fooUser',
          email: 'foo@example.com',
          photo: '',
        },
        viewCount: 42,
      },
      pinStatus: updateDto.pinStatus,
    };
  }

  deleteHistoryEntry(note: string) {
    //TODO: Use the database and actually do stuff
    throw new Error('Not implemented');
  }

  async toHistoryEntryDto(entry: HistoryEntry): Promise<HistoryEntryDto> {
    return {
      metadata: await this.notesService.getMetadata(entry.note),
      pinStatus: entry.pinStatus,
    };
  }
}
