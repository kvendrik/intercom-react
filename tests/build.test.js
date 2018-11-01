const {execSync} = require('child_process');

function execCommand(command) {
  execSync(command, {stdio: 'inherit'});
}

describe('build', () => {
  beforeEach(() => {
    execSync('yarn clean && yarn build');
  });

  it('generates valid types', () => {
    execCommand('yarn run tsc --noEmit build/**/*.d.ts');
  });
});
