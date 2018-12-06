import * as React from 'react';
import {shallow} from 'enzyme';
import {trigger} from '@shopify/enzyme-utilities';
import {ImportIsolatedRemote, BorderlessFrameListener} from '../components';
import Intercom from '..';

const mockIntercomSpy = jest.fn(frame => frame);
jest.mock('../utilities', () => ({
  ...require.requireActual('../utilities'),
  getIntercomFromFrame: () => mockIntercomSpy,
  injectCustomStyles() {
    return null;
  },
}));

describe('<Intercom />', () => {
  const mockProps = {
    appId: 'fyq3wodw',
    user: {
      user_id: '9876',
      email: 'john.doe@example.com',
      created_at: 1234567890,
      name: 'John Doe',
    },
  };

  beforeEach(() => {
    mockIntercomSpy.mockReset();
  });

  describe('appId', () => {
    it('is used to construct the script url', () => {
      const node = shallow(<Intercom {...mockProps} />);
      expect(node.find(ImportIsolatedRemote).prop('source')).toBe(
        `https://widget.intercom.io/widget/${mockProps.appId}`,
      );
    });

    it('intializes Intercom with the given appId', async () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = shallow(<Intercom {...mockProps} />);

      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);

      expect(mockIntercomSpy).toBeCalledWith(
        'boot',
        expect.objectContaining({
          app_id: mockProps.appId,
        }),
      );
    });
  });

  describe('user', () => {
    it('intializes Intercom with the given user', async () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = shallow(<Intercom {...mockProps} />);

      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);

      expect(mockIntercomSpy).toBeCalledWith(
        'boot',
        expect.objectContaining({
          ...mockProps.user,
        }),
      );
    });

    it('updates Intercom when the user data changes', () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = shallow(
        <Intercom {...mockProps} user={mockProps.user} />,
      );

      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);

      const newUser = {
        ...mockProps.user,
        email: 'john2@gmail.com',
      };

      intercom.setProps({user: newUser});
      expect(mockIntercomSpy).toHaveBeenCalledWith('update', newUser);
    });
  });

  describe('open', () => {
    it('calls Intercom with show command if initialized with open', () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = shallow(<Intercom {...mockProps} open />);
      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);
      expect(mockIntercomSpy).toHaveBeenCalledWith('show');
    });

    it('calls Intercom with show command if open prop changes', () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = shallow(<Intercom {...mockProps} />);
      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);
      intercom.setProps({open: true});
      expect(mockIntercomSpy).toHaveBeenCalledWith('show');
    });

    it('does not attempt to open intercom if not initialized', () => {
      const intercom = shallow(<Intercom {...mockProps} />);
      intercom.setProps({open: true});
      expect(mockIntercomSpy).not.toHaveBeenCalledWith('show');
    });

    it('resets frame styles when updated to a falsy value', () => {
      const removeAttributeSpy = jest.fn();
      const fakeIframe = {
        setAttribute: jest.fn(),
        removeAttribute: removeAttributeSpy,
      };
      const intercom = shallow(<Intercom {...mockProps} />);

      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);

      intercom.setProps({open: false});
      expect(removeAttributeSpy).toHaveBeenCalledWith('style');
    });
  });

  describe('launcher', () => {
    it('gets passed into the borderless frame', () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = shallow(<Intercom {...mockProps} launcher={false} />);
      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);
      expect(intercom.find(BorderlessFrameListener).prop('launcher')).toBe(
        false,
      );
    });

    it('is true by default', () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = shallow(<Intercom {...mockProps} />);
      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);
      expect(intercom.find(BorderlessFrameListener).prop('launcher')).toBe(
        true,
      );
    });
  });

  describe('onOpen()', () => {
    it('triggers when Intercom opens', () => {
      const onOpenSpy = jest.fn();
      const fakeIframe = document.createElement('iframe');
      const intercom = shallow(<Intercom {...mockProps} onOpen={onOpenSpy} />);

      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);

      const callback = getCallbackForEvent('onShow', mockIntercomSpy);
      callback();
      expect(onOpenSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onClose()', () => {
    it('triggers when Intercom closes', () => {
      const onCloseSpy = jest.fn();
      const fakeIframe = document.createElement('iframe');
      const intercom = shallow(
        <Intercom {...mockProps} onClose={onCloseSpy} />,
      );

      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);

      const callback = getCallbackForEvent('onHide', mockIntercomSpy);
      callback();
      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onUnreadCountChange()', () => {
    it('triggers when the unread count changes', () => {
      const onUnreadCountChangeSpy = jest.fn();
      const fakeIframe = document.createElement('iframe');
      const intercom = shallow(
        <Intercom
          {...mockProps}
          onUnreadCountChange={onUnreadCountChangeSpy}
        />,
      );

      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);

      const callback = getCallbackForEvent(
        'onUnreadCountChange',
        mockIntercomSpy,
      );
      callback();
      expect(onUnreadCountChangeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onInitialization()', () => {
    it('gets called on initialization', () => {
      const fakeIframe = document.createElement('iframe');
      const onInitializationSpy = jest.fn();
      const intercom = shallow(
        <Intercom {...mockProps} onInitialization={onInitializationSpy} />,
      );

      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);

      expect(onInitializationSpy).toHaveBeenCalledWith(mockIntercomSpy);
    });
  });

  describe('<ImportIsolatedRemote />', () => {
    it('renders', () => {
      const intercom = shallow(<Intercom {...mockProps} />);
      expect(intercom.find(ImportIsolatedRemote).exists()).toBeTruthy();
    });

    it('sets an onImported callback', () => {
      const intercom = shallow(<Intercom {...mockProps} />);
      expect(
        intercom.find(ImportIsolatedRemote).prop('onImported'),
      ).toBeInstanceOf(Function);
    });
  });

  describe('<BorderlessFrameListener />', () => {
    it('does not render initially', () => {
      const intercom = shallow(<Intercom {...mockProps} />);
      expect(intercom.find(BorderlessFrameListener).exists()).toBeFalsy();
    });

    it('renders when a frame is present', () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = shallow(<Intercom {...mockProps} />);
      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);
      expect(intercom.find(BorderlessFrameListener).exists()).toBeTruthy();
    });

    it('receives the current frame', () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = shallow(<Intercom {...mockProps} />);
      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);
      expect(intercom.find(BorderlessFrameListener).prop('frame')).toEqual(
        fakeIframe,
      );
    });

    it('updates the frame sizes when the content sizes update', () => {
      const setAttributeSpy = jest.fn();
      const fakeIframe = {
        setAttribute: setAttributeSpy,
        removeAttribute: jest.fn(),
      };
      const newSizes = {
        width: '200px',
        height: '200px',
      };
      const intercom = shallow(<Intercom {...mockProps} />);
      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);
      trigger(
        intercom.find(BorderlessFrameListener),
        'onSizesUpdate',
        newSizes,
      );
      expect(setAttributeSpy).toHaveBeenCalledWith(
        'style',
        'width: 200px; height: 200px;',
      );
    });
  });

  describe('shutdown event', () => {
    it('calls shutdown when component unmounts', async () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = shallow(<Intercom {...mockProps} />);
      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);
      intercom.unmount();
      expect(mockIntercomSpy).toHaveBeenCalledWith('shutdown');
    });
  });

  describe('<iframe />', () => {
    it('resets frame styles when opened', () => {
      const removeAttributeSpy = jest.fn();
      const fakeIframe = {
        setAttribute: jest.fn(),
        removeAttribute: removeAttributeSpy,
      };
      const intercom = shallow(<Intercom {...mockProps} />);

      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);

      const callback = getCallbackForEvent('onShow', mockIntercomSpy);
      callback();
      expect(removeAttributeSpy).toHaveBeenCalledWith('style');
    });

    it('resets frame styles when closed', () => {
      const removeAttributeSpy = jest.fn();
      const fakeIframe = {
        setAttribute: jest.fn(),
        removeAttribute: removeAttributeSpy,
      };
      const intercom = shallow(<Intercom {...mockProps} />);

      trigger(intercom.find(ImportIsolatedRemote), 'onImported', fakeIframe);

      const callback = getCallbackForEvent('onHide', mockIntercomSpy);
      callback();
      expect(removeAttributeSpy).toHaveBeenCalledWith('style');
    });
  });
});

function getCallbackForEvent(event: string, spy: jest.Mock) {
  const callback = spy.mock.calls.find(([eventName]) => eventName === event);
  if (!callback) {
    return null;
  }
  return callback[1];
}
