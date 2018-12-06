import * as React from 'react';
import {shallow} from 'enzyme';
import {createPortal} from 'react-dom';
import Portal from '..';

jest.mock('react-dom', () => ({
  ...require.requireActual('react-dom'),
  createPortal: jest.fn(() => null),
}));

const createPortalMock = createPortal as jest.Mock;

describe('<Portal />', () => {
  describe('children', () => {
    it('get used for the portal creation', () => {
      const children = <div />;
      shallow(<Portal>{children}</Portal>);
      expect(createPortalMock).toHaveBeenCalledWith(
        children,
        expect.anything(),
      );
    });

    it('are attached to the document body', () => {
      shallow(
        <Portal>
          <div />
        </Portal>,
      );
      expect(createPortalMock).toHaveBeenCalledWith(
        expect.anything(),
        document.body,
      );
    });
  });
});
