/*
 * SPDX-FileCopyrightText: 2021 The HedgeDoc developers (see AUTHORS file)
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Note } from '../notes/note.entity';

@Entity()
export class HistoryEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((_) => User, (user) => user.historyEntries, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne((_) => Note, (note) => note.historyEntries, {
    onDelete: 'CASCADE',
  })
  note: Note;

  @Column()
  pinStatus: boolean;

  public static create(user: User, note?: Note): HistoryEntry {
    const newHistoryEntry = new HistoryEntry();
    newHistoryEntry.user = user;
    if (note) {
      newHistoryEntry.note = note;
    }
    newHistoryEntry.pinStatus = false;
    return newHistoryEntry;
  }
}
