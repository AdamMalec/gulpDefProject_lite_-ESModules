import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import cleancss from 'gulp-clean-css';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import terser  from 'gulp-terser';
import del from 'del';
import browserSync from 'browser-sync';

import minmax from 'postcss-media-minmax';
import autoprefixer from 'autoprefixer';

const paths = {
  html: {
    source: 'source/*.html',
    build: 'build'
  },
  styles: {
    source: 'source/sass/style.scss',
    build: 'build/css'
  },
  scripts: {
    source: 'source/js/*.js',
    build: 'build/js'
  }
};

export const html = () => {
  return gulp.src(paths.html.source)
      .pipe(htmlmin({
          removeComments: true,
          collapseWhitespace: true,
      }))
      .pipe(gulp.dest(paths.html.build))
      .pipe(browserSync.stream())
};

export const styles = () => {
  return gulp.src(paths.styles.source)
    .pipe(sass())
    .pipe(postcss([
      minmax,
      autoprefixer,
    ]))
    .pipe(cleancss({
      level: 2
    }))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream())
};

export const scripts = () => {
  return gulp.src(paths.scripts.source)
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(concat('script.min.js'))
    .pipe(terser())
    .pipe(gulp.dest(paths.scripts.build))
    .pipe(browserSync.stream())
};

export const clean = () => {
  return del('build')
};

export const server = () => {
  browserSync.init({
    server: { baseDir: 'build' },
    notify: false,
    online: true,
    open: false,
    cors: true,
  })
};

export const startwatch = () => {
  gulp.watch('source/**/*.html', html);
  gulp.watch('source/sass/**/*.{scss,sass}', styles);
  gulp.watch('source/js/**/*.js', scripts);
};

export default gulp.parallel(html, styles, scripts, server, startwatch);
