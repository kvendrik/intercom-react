import * as React from 'react';
import {mount} from 'enzyme';
import {ImportIsolatedRemote} from '../components';
import Intercom from '..';

import * as styles from '../Intercom.scss';

const mockIntercomSpy = jest.fn();
jest.mock('../utils', () => ({
  ...require.requireActual('../utils'),
  getIntercomFromFrame: () => mockIntercomSpy,
}));

describe('<Intercom />', () => {
  const mockProps = {
    appId: 'fyq3wodw',
    userData: {
      user_id: '9876',
      email: 'john.doe@example.com',
      created_at: 1234567890,
      name: 'John Doe',
    },
  };

  beforeEach(() => {
    mockIntercomSpy.mockReset();
  });

  describe('<ImportIsolatedRemote />', () => {
    it('renders', async () => {
      const intercom = await mount(<Intercom {...mockProps} />);
      expect(intercom.find(ImportIsolatedRemote).exists()).toBeTruthy();
    });

    it('loads the Intercom script', async () => {
      const node = await mount(<Intercom {...mockProps} />);
      expect(node.find(ImportIsolatedRemote).prop('source')).toBe(
        `https://widget.intercom.io/widget/${mockProps.appId}`,
      );
    });

    it('passes in .Intercom as the initial className', async () => {
      const intercom = await mount(<Intercom {...mockProps} />);
      expect(intercom.find(ImportIsolatedRemote).prop('className')).toBe(
        styles.Intercom,
      );
    });

    it('sets an onImported callback', async () => {
      const intercom = await mount(<Intercom {...mockProps} />);
      expect(
        intercom.find(ImportIsolatedRemote).prop('onImported'),
      ).toBeInstanceOf(Function);
    });
  });

  describe('initialize', async () => {
    it('intializes Intercom with the given settings', async () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = await mount(<Intercom {...mockProps} />);

      intercom.find(ImportIsolatedRemote).prop('onImported')(fakeIframe);

      expect(mockIntercomSpy).toBeCalledWith('boot', {
        app_id: mockProps.appId,
        ...mockProps.userData,
      });
    });

    it('calls onInitialization', async () => {
      const fakeIframe = document.createElement('iframe');
      const onInitializationSpy = jest.fn();
      const intercom = await mount(
        <Intercom {...mockProps} onInitialization={onInitializationSpy} />,
      );

      intercom.find(ImportIsolatedRemote).prop('onImported')(fakeIframe);

      expect(onInitializationSpy).toHaveBeenCalledWith(mockIntercomSpy);
    });
  });

  describe('shutdown event', async () => {
    it('calls shutdown when component unmounts', async () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = await mount(<Intercom {...mockProps} />);
      intercom.find(ImportIsolatedRemote).prop('onImported')(fakeIframe);
      intercom.unmount();
      expect(mockIntercomSpy).toHaveBeenCalledWith('shutdown');
    });
  });

  describe('show event', () => {
    it('calls Intercom with show command if initialized with open', async () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = await mount(<Intercom {...mockProps} open />);
      intercom.find(ImportIsolatedRemote).prop('onImported')(fakeIframe);
      expect(mockIntercomSpy).toHaveBeenCalledWith('show');
    });

    it('calls Intercom with show command if open prop changes', async () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = await mount(<Intercom {...mockProps} />);
      intercom.find(ImportIsolatedRemote).prop('onImported')(fakeIframe);
      intercom.setProps({open: true});
      expect(mockIntercomSpy).toHaveBeenCalledWith('show');
    });

    it('does not attempt to open intercom if not initialized', async () => {
      const intercom = await mount(<Intercom {...mockProps} />);
      intercom.setProps({open: true});
      expect(mockIntercomSpy).not.toHaveBeenCalledWith('show');
    });
  });

  describe('update event', () => {
    it('updates Intercom when the locationKey changes', async () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = await mount(
        <Intercom {...mockProps} locationKey="/home" />,
      );
      intercom.find(ImportIsolatedRemote).prop('onImported')(fakeIframe);
      intercom.setProps({locationKey: '/about'});
      expect(mockIntercomSpy).toHaveBeenCalledWith(
        'update',
        mockProps.userData,
      );
    });

    it('updates Intercom when the userData changes', async () => {
      const fakeIframe = document.createElement('iframe');
      const intercom = await mount(
        <Intercom {...mockProps} userData={mockProps.userData} />,
      );
      intercom.find(ImportIsolatedRemote).prop('onImported')(fakeIframe);

      const newUserData = {
        ...mockProps.userData,
        email: 'john2@gmail.com',
      };

      intercom.setProps({userData: newUserData});
      expect(mockIntercomSpy).toHaveBeenCalledWith('update', newUserData);
    });
  });

  describe('event callbacks', () => {
    it('triggers onOpen when Intercom opens', async () => {
      const onOpenSpy = jest.fn();
      const fakeIframe = document.createElement('iframe');
      const intercom = await mount(
        <Intercom {...mockProps} onOpen={onOpenSpy} />,
      );

      intercom.find(ImportIsolatedRemote).prop('onImported')(fakeIframe);

      const callback = getCallbackForEvent('onShow', mockIntercomSpy);
      callback();
      expect(onOpenSpy).toHaveBeenCalledTimes(1);
    });

    it('triggers onClose when Intercom opens', async () => {
      const onCloseSpy = jest.fn();
      const fakeIframe = document.createElement('iframe');
      const intercom = await mount(
        <Intercom {...mockProps} onClose={onCloseSpy} />,
      );

      intercom.find(ImportIsolatedRemote).prop('onImported')(fakeIframe);

      const callback = getCallbackForEvent('onHide', mockIntercomSpy);
      callback();
      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });

    it('triggers onUnreadCountChange when Intercom opens', async () => {
      const onUnreadCountChangeSpy = jest.fn();
      const fakeIframe = document.createElement('iframe');
      const intercom = await mount(
        <Intercom
          {...mockProps}
          onUnreadCountChange={onUnreadCountChangeSpy}
        />,
      );

      intercom.find(ImportIsolatedRemote).prop('onImported')(fakeIframe);

      const callback = getCallbackForEvent(
        'onUnreadCountChange',
        mockIntercomSpy,
      );
      callback();
      expect(onUnreadCountChangeSpy).toHaveBeenCalledTimes(1);
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
