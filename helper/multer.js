const multer = require('multer'),
    path = require('path');
const size = 1000000; //1mb
module.exports = (type = 'memory', config = {}) => {
    let storage;
    if (type === 'disk')
        storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'assets')
            },
            filename: (req, file, cb) => {
                cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
            }
        })
    else
        storage = multer.memoryStorage();


    return upload = multer({
        storage,
        limits: {
            fileSize: size
        },
        ...config,
        fileFilter: (req, file, cb) => {
            checkFileType(file, cb);
        }
    })
}
function checkFileType(file, cb) {
    const whiteListFileExt = ['.jpeg', '.jpg', '.png', '.gif'].includes(path.extname(file.originalname).toLowerCase());
    const whiteListMimeType = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype);
    if (whiteListFileExt && whiteListMimeType)
        return cb(null, true);

    return cb(new Error('only Image'));
}

/**
 * using
 * multerService = require('..')
 * const upload = multerService(type='memory || disk',config).single('avatar');
 *                                              .array('avatar',12)
 *                                              .field([{name:'avatar',maxCount:1}])
 * upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
    }

    // Everything went fine.
  })
 */
