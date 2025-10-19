import React, { useMemo, useCallback } from 'react';
import type { SongContextType, GroupField } from './song-context';
import { SongList, type Song } from '../lib/song';
// grouping type removed from context usage
import { SongContext } from './song-context';
import { groupBy, type Dictionary } from 'lodash';
import { normalizeNameKey } from '@/lib/utils';
import type { Grouping } from './song-context';

function generateGroups(songs: Array<Song>, field: GroupField): Dictionary<{ grouping: Grouping; songs: Song[] }> {
  let sortedSongs: Song[] = [];
  let rawGrouped: Dictionary<Song[]> = {};
  const result: Dictionary<{ grouping: Grouping; songs: Song[] }> = {};

  switch (field) {
    case 'artist': {
      const normalizeArtist = (name: string) => name.replace(/^\s*(?:the|a)\s+/i, '').trim();
      // Primary: normalized artist, Secondary: song name
      sortedSongs = [...songs].sort((a, b) => {
        const pa = normalizeArtist(a.artist).localeCompare(normalizeArtist(b.artist));
        if (pa !== 0) return pa;
        return a.name.localeCompare(b.name);
      });
      rawGrouped = groupBy(sortedSongs, (song) => normalizeArtist(song.artist));
      // build result with grouping metadata
      Object.keys(rawGrouped).forEach((k) => {
        result[k] = { grouping: { field: 'artist', value: k, count: rawGrouped[k].length }, songs: rawGrouped[k] };
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
      rawGrouped = groupBy(sortedSongs, (song) => song.genre);
      Object.keys(rawGrouped).forEach((k) => {
        result[k] = { grouping: { field: 'genre', value: k, count: rawGrouped[k].length }, songs: rawGrouped[k] };
      });
      break;
    }
    case 'name': {
      sortedSongs = [...songs].sort((a, b) => a.name.localeCompare(b.name));
      rawGrouped = groupBy(sortedSongs, (song) => normalizeNameKey(song.name));
      Object.keys(rawGrouped).forEach((k) => {
        result[k] = { grouping: { field: 'name', value: k, count: rawGrouped[k].length }, songs: rawGrouped[k] };
      });
      break;
    }
    default:
      throw new Error(`Unsupported group field: ${field}`);
  }

  return result;
}

export function SongProvider({ children }: { children: React.ReactNode }) {
  const [songs, setSongs] = React.useState<Array<Song>>(SongList);
  const [headerType, setHeaderType] = React.useState<GroupField>('artist');
  const [groupedSongs, setGroupedSongs] = React.useState<Dictionary<{ grouping: Grouping; songs: Song[] }>>(() =>
    generateGroups(SongList, 'artist')
  );

  const filter = useCallback((search: string, field: GroupField) => {
    const filtered = filteredSongs(search, field);
    const generatedGroups = generateGroups(filtered, field);
    setSongs(filtered);
    setGroupedSongs(generatedGroups);
    setHeaderType(field);
  }, []);

  const changeGroup = useCallback(
    (field: GroupField) => {
      const generatedGroups = generateGroups(songs, field);
      setGroupedSongs(generatedGroups);
      setHeaderType(field);
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
      groupedSongs: groupedSongs,
      headerType: headerType,
      count: SongList.length,
      groupBy: (field: GroupField) => changeGroup(field),
      filterArtist: (search: string) => filter(search, 'artist'),
      filterSongName: (search: string) => filter(search, 'name'),
      filterGenre: (search: string) => filter(search, 'genre')
    };
  }, [songs, groupedSongs, headerType, changeGroup, filter]);

  return <SongContext.Provider value={value}>{children}</SongContext.Provider>;
}

// Note: hooks that consume the context are implemented in a separate file
// to avoid Fast Refresh issues when a file exports non-component helpers.
