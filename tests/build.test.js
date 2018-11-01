const {execSync} = require('child_process');
const fs = require('fs');

function execCommand(command) {
  execSync(command, {stdio: 'inherit'});
}

describe('build', () => {
  beforeAll(() => {
    execCommand('yarn clean');
  });

  beforeEach(() => {
    execCommand('yarn build');
  });

  afterEach(() => {
    execCommand('yarn clean');
  });

  it('generates valid types', () => {
    expect(fs.existsSync('./build/Intercom/index.d.ts')).toBe(true);
    execCommand('yarn run tsc --noEmit build/Intercom/**/*.d.ts');
  });
});
