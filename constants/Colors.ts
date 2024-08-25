const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    placeholderColor: '#888',
    background: '#eee',
    inputBackground: '#ddd',
    card: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    placeholderColor: '#bbb',
    background: '#000',
    inputBackground: '#333',
    card: '#111',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

export const STORAGE_KEY = 'appData';
