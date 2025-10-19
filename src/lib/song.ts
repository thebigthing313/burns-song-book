import songsData from '../data/songs.json';

export type Song = {
  id: string;
  name: string;
  artist: string;
  album: string;
  genre: string;
  charter: string;
  year: string;
  length: number;
};

// Normalize the incoming JSON which uses different casing/field names
// (e.g. "Name", "Artist", "songlength") into the lowercase `Song` shape
// expected by the rest of the app.
const raw = songsData as unknown as Array<Record<string, unknown>>;

function asString(value: unknown) {
  if (value === undefined || value === null) return '';
  return String(value);
}

function asNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function getField(obj: Record<string, unknown>, ...keys: string[]) {
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      const v = obj[k];
      if (v !== undefined && v !== null) return v;
    }
  }
  return undefined;
}

export const SongList: Song[] = raw.map((s, index) => ({
  id: `song-${index + 1}`,
  name: asString(getField(s, 'Name', 'name')),
  artist: asString(getField(s, 'Artist', 'artist')),
  album: asString(getField(s, 'Album', 'album')),
  genre: asString(getField(s, 'Genre', 'genre')),
  charter: asString(getField(s, 'Charter', 'charter')),
  year: asString(getField(s, 'Year', 'year')),
  length: asNumber(getField(s, 'songlength', 'length'))
}));
