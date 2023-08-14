// @ts-nocheck

import autoprefixer from 'autoprefixer';
import cssnanoPlugin from 'cssnano';

export const config = {
  plugins: [autoprefixer, cssnanoPlugin({ preset: 'advanced' })],
};
