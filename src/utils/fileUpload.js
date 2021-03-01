import fs from 'fs';
import path from 'path';
import multer from '@koa/multer';
import iconv from 'iconv-lite';

const rootPath = path.normalize(__dirname + '/..');

// const upload = multer();

export const multerSetting = (isDir, sizeLimit) => {  
  if (isDir) {
    let storage = multer.diskStorage({
      destination(ctx, file, cb) {
        let uploadDir = path.join(rootPath, '/public/uploads/') + isDir;
        if(!dirExists(uploadDir)) {
          fs.mkdir(uploadDir, (err) => {
            if (err) throw err;
          });
        };
        cb(null, uploadDir);
      },
      filename(ctx, file, cb) {
        cb(null, getDate(new Date()) + '_' + file.originalname);
      }
    });
    return multer ({
      storage: storage,
      limits: {
        files: 15,
        fileSize: sizeLimit * 1024 * 1024
      },
      fileFilter(ctx, file, cb) {        
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          console.log('파일 확장자: ' + !file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
          return cb(new Error('이미지만 가능합니다!'), false);
        } else {
          return cb(null, iconv.decode(file.originalname, 'utf-8'), true);
        }
      }
    });
  } else {
    throw new Error('파일 업로드가 실패했습니다.');
  }
};

export const fileOriginalName = (Files) => {
  if(Files === undefined || Files.length === 0) {
    // throw new Error('The parameter is omitted.. OTL');
    return null;
  } else {
    let fileOriginalName = Files.map((file) => {
      return file.originalname;
    });
    return fileOriginalName;
  };
};

export const fileName = (Files) => {
  if(Files === undefined || Files.length === 0) {
    // throw new Error('The parameter is omitted.. OTL');
    return null;
  } else {
    let fileName = Files.map((file) => {
      return getDate(new Date()) + '_' + file.originalname;
    });
    return fileName;
  };
};

const getDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  const fullDate = year + '' + month + '' + day + '' + hour + '' + min + '' + sec;

  return fullDate;
};

const dirExists = (absoluteDir) => {
  try {
    if(Array.isArray(absoluteDir)) {
      let flag = [];
      absoluteDir.forEach((Dir) => {
        flag.push(fs.statSync(Dir).isDirectory());
      });
      if(flag.indexOf(false) === -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return fs.statSync(absoluteDir).isDirectory();
    }
  } catch(e) {
    if(e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
};