const gulp = require('gulp');
const runSequence = require('run-sequence');
const nodemon = require('gulp-nodemon');
const del = require('del');
const { GulpSSHDeploy } = require('gulp-ssh-deploy');

const run = require('gulp-run-command').default;

const gulpConfig = {
  nodemon: {
    nodemon: require('nodemon'),
    script: 'server/index.ts',
    ext: 'ts',
    watch: ['server/**/*.ts'],
    env: { NODE_ENV: 'development' },
    execMap: {
      ts:
        'ts-node --files --typeCheck --compilerOptions \'{"module":"commonjs"}\''
    }
  },
  copyfiles: ['package.json', 'config/*.json', 'pm2.dev.config.json'],
  sshDeploy: {
    host: 'localhost',
    port: 22,
    package_json_file_path: 'package.json',
    source_files: './dist/**/*',
    remote_directory: 'path to deploy',
    username: '',
    ssh_key_file: '~/.ssh/id_rsa',
    releases_to_keep: 10,
    permissions: 'ugo+rX'
  }
};

gulp.task('copyfile', () => {
  for (const fileUrl of gulpConfig.copyfiles) {
    gulp.src(fileUrl, { base: './' }).pipe(gulp.dest('.next'));
  }
});

gulp.task('nodemon', () => {
  nodemon(gulpConfig.nodemon);
});

gulp.task('next', run('npm run build'));

gulp.task('clean', () => del.sync(['.next/**']));

gulp.task('build', (callback) =>
  runSequence('clean', 'next', 'copyfile', callback)
);

gulp.task('default', (callback) => runSequence('nodemon', callback));

gulp.task('deploy', (callback) =>
  runSequence('clean', 'copyfile', 'tsc', 'release', callback)
);

try {
  new GulpSSHDeploy(gulpConfig.sshDeploy, gulp);
} catch (e) {
  console.error(e);
}
