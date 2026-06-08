import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 //3MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.includes('pdf')) {
            return cb(new Error('Only PDF allowed'));
        }

        cb(null, true);
    }
})


export default upload;