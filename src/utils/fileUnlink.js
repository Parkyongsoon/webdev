import fs from 'fs';

export const fileUnlink = (length, path, dir, file) => {
  for(let i = 0; i < length; i++ ) {
    fs.unlink(path + dir + file[i], (err) => {
      if (err) throw err;
    });
  };
};