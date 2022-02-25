import { paths } from "../gulpfile.babel";

const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageResize = require('gulp-image-resize');
const rename = require('gulp-rename');

import imageminPngquant from "imagemin-pngquant";
import imageminZopfli from "imagemin-zopfli";
import imageminMozjpeg from "imagemin-mozjpeg";

import browsersync from "browser-sync";

import debug from "gulp-debug";

gulp.task('resize', () => {
    const sizes = [{
            width: 320,
            suffix: '320'
        },
        {
            width: 480,
            suffix: '480'
        },
        {
            width: 768,
            suffix: '768'
        },
        {
            width: 1024,
            suffix: '1024'
        },
    ];
    let stream;
    sizes.forEach((size) => {
        stream = gulp
            .src(paths.resize.src)
            .pipe(imageResize({
                width: size.width,
                height: size.width,
                crop: true,
            }))
            .pipe(
                rename((path) => {
                    path.basename += `-${size.suffix}`;
                }),
            )
            /* .pipe(
                imagemin([
                    imageminPngquant({
                        speed: 5,
                        quality: [0.6, 0.8]
                    }),
                    imageminZopfli({
                        more: true
                    }),
                    imageminMozjpeg({
                        progressive: true,
                        quality: 90
                    })
                ]),
            ) */
            .pipe(debug({
                "title": "Image crop"
            }))
            .pipe(gulp.dest(paths.resize.dist))
            .pipe(browsersync.stream());
    });
    return stream;
});