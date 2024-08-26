const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    placeholder: '#888',
    background: '#eee',
    inputBackground: '#ddd',
    card: '#fff',
    success: '#090',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    placeholder: '#bbb',
    background: '#000',
    inputBackground: '#333',
    card: '#111',
    success: '#0f0',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

export const STORAGE_KEY = 'appData';
