import * as React from 'react';
import {mount} from 'enzyme';
import Portal from '..';

describe('<Portal />', () => {
  it('renders children into the document body', async () => {
    await mount(
      <Portal>
        <div id="portal-test-node" />
      </Portal>,
    );
    const node = document.body.querySelector('#portal-test-node');
    expect(node).toBeInstanceOf(HTMLDivElement);
  });
});
