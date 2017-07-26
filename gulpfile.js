var gulp = require('gulp'),  
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    clean = require('gulp-clean'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync').create(),
    reload=browserSync.reload,
    fileinclude = require('gulp-file-include'),
    base64 = require('gulp-base64'),
    mkdirp = require('mkdirp');

// 静态服务器 + 监听 html/css/js 文件
gulp.task('serve', function() {
  browserSync.init({
    server: "dist/"
  });
  gulp.watch("dist/*.html").on('change', reload);
  gulp.watch("dist/css/*.css").on('change', reload);
  gulp.watch("dist/js/*.js").on('change', reload);
});
// scss编译并加前缀
gulp.task('styles', function() {  
  return gulp.src('src/css/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 version'],
      cascade: false
    }))
    .pipe(base64({
      maxImageSize: 8*1024, // bytes 
      debug: true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(plumber.stop())
    .pipe(gulp.dest('dist/css'));
});
// es6编译
gulp.task('babel', function(){
  return gulp.src('src/js/*.js')
  .pipe(babel())
  .pipe(gulp.dest('dist/js'))
})
//html加载模板
gulp.task('include', function(){
  return gulp.src('src/*.html')
  .pipe(plumber())
  .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))//导入include文件
  .pipe(plumber.stop())
  .pipe(gulp.dest('dist/'));
});
// 清理dist目录
gulp.task('clean', function(){
  return gulp.src('dist/')
  .pipe(clean());
})
// 复制文件
gulp.task('copy', function(){
  return gulp.src('src/images/**/*.*')
  .pipe(plumber())
  .pipe(plumber.stop())
  .pipe(gulp.dest('dist/images'))
})
// 监听
gulp.task('watch', function() {
  // 监听所有scss
  gulp.watch('src/css/*.scss', ['styles']);
  gulp.watch('src/*.html', ['include']); 
  gulp.watch('src/include/**/*.inc', ['include']); 
  gulp.watch('src/js/*.js', ['babel']);
  gulp.watch('src/images/**/*.*', ['copy']);
});

gulp.task('build', ['clean'], function(){
  gulp.start(
    'copy',
    'include',
    'styles',
    'babel'
  )
})
gulp.task('default', function() {  
  gulp.start(
    'serve',
    'watch');
});
