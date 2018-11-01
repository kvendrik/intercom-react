const {execSync} = require('child_process');

function execCommand(command) {
  execSync(command, {stdio: 'inherit'});
}

describe('build', () => {
  beforeEach(() => {
    execCommand('yarn build');
  });

  afterEach(() => {
    execCommand('yarn clean');
  });

  it('generates valid types', () => {
    execCommand('yarn run tsc --noEmit build/**/*.d.ts');
  });
});
