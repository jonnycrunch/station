import gulp from 'gulp'
import runSequence from 'run-sequence'
import {flatten, compact} from 'lodash'

// Available targets
const archs = ['ia32', 'x64']
const platforms = ['linux', 'win32', 'darwin']
const linuxPackageTargets = ['deb', 'rpm']

const combinations = compact(flatten(archs.map(arch => {
  return platforms.map(platform => {
    // No 32bit build for OS X
    if (platform === 'darwin' && arch === 'ia32') return

    return {platform, arch}
  })
})))

gulp.task('clean', () => {
  // Clean the release directory
})

// Build tasks for the different platforms
// When building Windows on non Windows platforms you need to install
// wine
combinations.forEach(({platform, arch}) => {
  gulp.task(`build:${platform}:${arch}`, () => {
    // Most of what is done in pkg.js
    // Use electron-rebuild to ensure native module compat
  })
})

// Codesigning the OS X version, only runs on OS X with Xcode setup
gulp.task('sign:darwin', ['build:darwin'], () => {

})

// Package the OS X version using appdmg, only runs on OS X
gulp.task('pack:darwin', ['sign:darwin'], () => {

})

// Create installers for the windows versions using `makensis`
combinations.filter(({arch}) => arch === 'win32').forEach(({platform, arch}) => {
  gulp.task(`pack:${platform}:${arch}`, [`build:${platform}:${arch}`], () => {

  })
})

// Create linux packages using fpm
combinations.filter(({arch}) => arch === 'linux').forEach(({platform, arch}) => {
  linuxPackageTargets.forEach(target => {
    gulp.task(`pack:${platform}:${arch}:${target}`, [`build:${platform}:${arch}`], () => {

    })
  })
})

// All the windows packages
gulp.task('pack:windows', done => {
  runSequence(
    'pack:windows:ia32',
    'pack:windows:x64',
    done
  )
})

// All the linux packages
gulp.task('pack:linux', done => {
  runSequence(
    'pack:linux:ia32:rpm',
    'pack:linux:ia32:deb',
    'pack:linux:x64:rpm',
    'pack:linux:x64:deb',
    done
  )
})

// All the packages
gulp.task('release:pack', done => {
  runSequence(
    'pack:darwin',
    'pack:windows',
    'pack:linux',
    done
  )
})

// Linting
gulp.task('lint', () => {
  // gulp-eslint
})

gulp.task('release:bump', () => {
  // https://github.com/stevelacy/gulp-bump
  // Detect version via --major --minor --patch
  // using gulp-util.env
})

// Generate the changelog
gulp.task('release:changelog', () => {
  // https://github.com/stevemao/gulp-conventional-changelog
})

gulp.task('relase:commit', () => {
  // git add package.json CHANGELOG.md
  // git commit -m "chore: Release <version>"
  // git tag <version>
  // git push upstream master --tags

  // see https://github.com/stevelacy/gulp-git
})

// Publish github release
gulp.task('release:github', () => {
  // https://github.com/remixz/publish-release
  // https://github.com/stevemao/conventional-github-releaser
})

// Create a full relase
gulp.task('release', done => {
  runSequence(
    'lint',
    'pack',
    'release:bump',
    'release:changelog',
    'release:commit',
    'release:github',
    done
  )
})
