import React, { useMemo, useCallback } from 'react';
import type { SongContextType, GroupField } from './song-context';
import { SongList, type Song } from '../lib/song';
import type { Grouping } from './song-context';
import { SongContext } from './song-context';
import { countBy, groupBy, type Dictionary } from 'lodash';
import { normalizeNameKey } from '@/lib/utils';

function generateGroups(
  songs: Array<Song>,
  field: GroupField
): { groups: Array<string>; rows: Array<Song | Grouping>; stickyIndexes: number[] } {
  const groupingMap: Dictionary<Grouping> = {};
  let sortedSongs: Song[] = [];
  let countedSongs: Dictionary<number> = {};
  let groupedSongs: Dictionary<Song[]> = {};

  switch (field) {
    case 'artist': {
      // Normalize artist names for sorting/grouping by removing leading "A " or "The " (case-insensitive)
      const normalizeArtist = (name: string) => {
        return name.replace(/^\s*(?:the|a)\s+/i, '').trim();
      };

      // Primary: normalized artist, Secondary: song name
      sortedSongs = [...songs].sort((a, b) => {
        const pa = normalizeArtist(a.artist).localeCompare(normalizeArtist(b.artist));
        if (pa !== 0) return pa;
        return a.name.localeCompare(b.name);
      });
      countedSongs = countBy(sortedSongs, (song) => song.artist);
      groupedSongs = groupBy(sortedSongs, (song) => {
        const key = song.artist;
        // Use the normalized key for grouping, but store/display the original artist name elsewhere if needed
        groupingMap[key] = { field: 'artist', value: key, count: countedSongs[key] };
        return key;
      });
      break;
    }
    case 'genre': {
      // Primary: genre, Secondary: song name
      sortedSongs = [...songs].sort((a, b) => {
        const pg = a.genre.localeCompare(b.genre);
        if (pg !== 0) return pg;
        return a.name.localeCompare(b.name);
      });
      countedSongs = countBy(sortedSongs, (song) => song.genre);
      groupedSongs = groupBy(sortedSongs, (song) => {
        const key = song.genre;
        groupingMap[key] = { field: 'genre', value: key, count: countedSongs[key] };
        return key;
      });
      break;
    }
    case 'name': {
      sortedSongs = [...songs].sort((a, b) => a.name.localeCompare(b.name));
      countedSongs = countBy(sortedSongs, (song) => normalizeNameKey(song.name));
      groupedSongs = groupBy(sortedSongs, (song) => {
        const key = normalizeNameKey(song.name);
        groupingMap[key] = { field: 'name', value: key, count: countedSongs[key] };
        return key;
      });
      break;
    }
    default:
      throw new Error(`Unsupported group field: ${field}`);
  }

  const groups = Object.keys(groupedSongs);
  const stickyIndexes: number[] = [];
  let currentIndex = 0; // Keep a running count of the index

  const rows = groups.reduce<Array<Song | Grouping>>((acc, k) => {
    const header = groupingMap[k];
    const songsInGroup = groupedSongs[k];

    // 1. Record the index of the header *before* adding it to the accumulator
    stickyIndexes.push(currentIndex);

    // 2. Add the header and increment index count
    acc.push(header);
    currentIndex++;

    // 3. Add the songs and increment index count
    acc.push(...songsInGroup);
    currentIndex += songsInGroup.length;

    return acc;
  }, []);

  // Return the generated stickyIndexes along with groups and rows
  return { groups, rows, stickyIndexes };
}

export function SongProvider({ children }: { children: React.ReactNode }) {
  const { groups: initialGroups, rows: initialRows, stickyIndexes: initialStickyIndexes } = generateGroups(SongList, 'artist');

  const [rows, setRows] = React.useState<Array<Song | Grouping>>(initialRows);
  const [songs, setSongs] = React.useState<Array<Song>>(SongList);
  const [headers, setHeaders] = React.useState<string[]>(initialGroups);
  const [stickyIndexes, setStickyIndexes] = React.useState<number[]>(initialStickyIndexes);
  const [headerType, setHeaderType] = React.useState<GroupField>('artist');

  const filter = useCallback((search: string, field: GroupField) => {
    const filtered = filteredSongs(search, field);
    const generatedGroups = generateGroups(filtered, field);
    setSongs(filtered);
    setRows(generatedGroups.rows);
    setHeaders(generatedGroups.groups);
    setHeaderType(field);
    setStickyIndexes(generatedGroups.stickyIndexes);
  }, []);

  const changeGroup = useCallback(
    (field: GroupField) => {
      const generatedGroups = generateGroups(songs, field);
      setRows(generatedGroups.rows);
      setHeaders(generatedGroups.groups);
      setHeaderType(field);
      setStickyIndexes(generatedGroups.stickyIndexes);
    },
    [songs]
  );

  // Memoize to avoid re-creating functions/objects on every render

  function filteredSongs(search: string, field: GroupField) {
    switch (field) {
      case 'artist':
        return SongList.filter((song) => song.artist.toLowerCase().includes(search.toLowerCase()));
      case 'name':
        return SongList.filter((song) => song.name.toLowerCase().includes(search.toLowerCase()));
      case 'genre':
        return SongList.filter((song) => song.genre.toLowerCase().includes(search.toLowerCase()));
      default:
        return [];
    }
  }

  const value = useMemo<SongContextType>(() => {
    return {
      originalSongs: SongList,
      songs: songs,
      rows: rows,
      headers: headers,
      stickyIndexes: stickyIndexes,
      headerType: headerType,
      count: SongList.length,
      groupBy: (field: GroupField) => changeGroup(field),
      filterArtist: (search: string) => filter(search, 'artist'),
      filterSongName: (search: string) => filter(search, 'name'),
      filterGenre: (search: string) => filter(search, 'genre')
    };
  }, [songs, rows, headers, stickyIndexes, headerType, changeGroup, filter]);

  return <SongContext.Provider value={value}>{children}</SongContext.Provider>;
}

// Note: hooks that consume the context are implemented in a separate file
// to avoid Fast Refresh issues when a file exports non-component helpers.
