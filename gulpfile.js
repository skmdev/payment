const gulp = require('gulp');
const runSequence = require('run-sequence');
const nodemon = require('gulp-nodemon');
const del = require('del');

const run = require('gulp-run-command').default;

const gulpConfig = {
  nodemon: {
    nodemon: require('nodemon'),
    script: 'server/index.ts',
    ext: 'ts',
    watch: ['server/**/*.ts'],
    env: { NODE_ENV: 'development', PRETTY: 'true' },
    execMap: {
      ts:
        'ts-node --files --typeCheck --compilerOptions \'{"module":"commonjs"}\''
    }
  },
  copyfiles: ['package.json', './config/*.json', 'pm2.dev.config.json']
};

gulp.task('copyfile', () => {
  for (const fileUrl of gulpConfig.copyfiles) {
    gulp
      .src(fileUrl, { base: './' })
      .pipe(gulp.dest('.next/production-server'));
  }
});

gulp.task('nodemon', () => {
  nodemon(gulpConfig.nodemon);
});

gulp.task('next', run('npm run build:next'));

gulp.task('clean', () => del.sync(['.next/**']));

gulp.task('build', (callback) =>
  runSequence('clean', 'next', 'copyfile', callback)
);

gulp.task('default', (callback) => runSequence('nodemon', callback));
