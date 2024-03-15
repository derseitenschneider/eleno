/* eslint-disable no-console */
const fs = require('fs');
const parseVersionString = require('parse-version-string').default;
const { execSync } = require('child_process');

const pkg = require('../package.json');

const updatePatch = () => {
  try {
    const { major, minor, patch } = parseVersionString(pkg.version);
    const newVersion = `${major}.${minor}.${patch + 1}`;

    const pkgs = ['./package.json', './app/package.json'].filter(fs.existsSync);
    console.log(pkgs.length);

    pkgs.forEach((pkgJson) => {
      const pkgValues = JSON.parse(fs.readFileSync(pkgJson, 'utf8'));
      pkgValues.version = newVersion;
      fs.writeFileSync(pkgJson, JSON.stringify(pkgValues, null, 2));
      execSync(`git add ${pkgJson}`);
      console.log(`updated ${pkgJson}`);
    });

    console.log('application updated to', newVersion, 'version');
  } catch (e) {
    console.log('Version update failed', e);
  }
};

updatePatch();
