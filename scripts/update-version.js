/* eslint-disable no-console */
const fs = require('fs');
const parseVersionString = require('parse-version-string').default;
const { execSync } = require('child_process');
// const mainPackage = require('../package.json');
// const appPackage = require('../app/package.json');

// const fs = require('fs')
// const parseVersionString = require('parse-version-string').default
// const { execSync } = require('child_process')
const pkg = require('../package.json');

console.log(
  'Last commit-message: ' + execSync('git rev-parse HEAD').toString().trim()
);

const updatePatch = () => {
  try {
    // const pkg = require('../package.json')

    // execSync('git remote show origin')

    const { major, minor, patch } = parseVersionString(pkg.version);
    const newVersion = `${major}.${minor}.${patch + 1}`;

    const pkgs = ['../package.json', '../app/package.json'].filter(
      fs.existsSync
    );

    pkgs.forEach((pkgJson) => {
      const pkgValues = JSON.parse(fs.readFileSync(pkgJson, 'utf8'));
      pkgValues.version = newVersion;
      fs.writeFileSync(pkgJson, JSON.stringify(pkgValues, null, 2));
      execSync(`git add ${pkgJson}`);
      console.log(`updated ${pkgJson}`);
    });

    // const wpPluginFile =
    //   './apps/wp.wp-deploy.hello/wp-content/plugins/deploy-wp/deploy-wp.php'
    // const wpPluginFileContent = fs.readFileSync(wpPluginFile, 'utf8')
    // const regex = /Version: [0-9\.]*/gm
    // const versionOld = regex.exec(wpPluginFileContent)[0]
    // const versionNew = `Version: ${newVersion}`
    // const newWpPluginFileContnt = wpPluginFileContent.replace(
    //   versionOld,
    //   versionNew,
    // )
    // fs.writeFileSync(wpPluginFile, newWpPluginFileContnt)
    // execSync(`git add ${wpPluginFile}`)
    // console.log(`updated ${wpPluginFile}`)

    console.log('application updated to', newVersion, 'version');
  } catch (e) {
    console.log('Version update failed', e);
  }
};

updatePatch();
