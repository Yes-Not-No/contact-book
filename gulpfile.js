const gulp = require("gulp");
const sync = require("browser-sync");
const sass = require('gulp-sass')(require('sass'));

const styles = () => {
    return gulp.src("source/scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("source/css"))
    .pipe(sync.reload({stream: true}))
};

exports.styles = styles;

const server = (done) => {
    sync.init({
        server: {
            baseDir: 'source'
        },
        notify: false
    })
    done()
};

exports.server = server;

const watcher = () => {
    gulp.watch('source/**/*.html').on("change", sync.reload);
    gulp.watch('source/scss/*.scss').on("change", styles);
    gulp.watch('source/scss/*.scss').on("change", sync.reload);
    gulp.watch('source/js/*.js').on("change", sync.reload);
}

exports.watcher = watcher;

exports.default = gulp.series(
    styles, server, watcher
);