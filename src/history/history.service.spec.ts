/*
 * SPDX-FileCopyrightText: 2021 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '../logger/logger.module';
import { HistoryService } from './history.service';
import { UsersModule } from '../users/users.module';
import { NotesModule } from '../notes/notes.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Identity } from '../users/identity.entity';
import { User } from '../users/user.entity';
import { AuthorColor } from '../notes/author-color.entity';
import { Authorship } from '../revisions/authorship.entity';
import { HistoryEntry } from './history-entry.enity';
import { Note } from '../notes/note.entity';
import { Tag } from '../notes/tag.entity';
import { AuthToken } from '../auth/auth-token.entity';
import { Revision } from '../revisions/revision.entity';

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        {
          provide: getRepositoryToken(HistoryEntry),
          useValue: {},
        },
      ],
      imports: [LoggerModule, UsersModule, NotesModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue({})
      .overrideProvider(getRepositoryToken(AuthToken))
      .useValue({})
      .overrideProvider(getRepositoryToken(Identity))
      .useValue({})
      .overrideProvider(getRepositoryToken(Authorship))
      .useValue({})
      .overrideProvider(getRepositoryToken(AuthorColor))
      .useValue({})
      .overrideProvider(getRepositoryToken(Revision))
      .useValue({})
      .overrideProvider(getRepositoryToken(Note))
      .useValue({})
      .overrideProvider(getRepositoryToken(Tag))
      .useValue({})
      .overrideProvider(getRepositoryToken(HistoryEntry))
      .useValue({})
      .compile();

    service = module.get<HistoryService>(HistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
