import * as React from 'react';
import {mount, shallow} from 'enzyme';
import ImportIsolatedRemote from '..';

describe('<ImportIsolatedRemote />', () => {
  const mockProps = {
    title: 'some-title',
    source: 'some-url',
    onImported: () => {},
  };

  describe('title', () => {
    it('gets passed into the iframe', () => {
      const node = shallow(<ImportIsolatedRemote {...mockProps} />);
      expect(node.find('iframe').prop('title')).toBe(mockProps.title);
    });
  });

  describe('source', () => {
    it('imports the given source', () => {
      const onImportedSpy = jest.fn();
      const node = mount(
        <ImportIsolatedRemote {...mockProps} onImported={onImportedSpy} />,
      );
      const iframeNode = node.find('iframe').getDOMNode() as HTMLIFrameElement;
      const script = iframeNode.contentWindow!.document.querySelector('script');
      expect(script!.src).toBe(mockProps.source);
    });

    it('doesnt load script when the iframe has loaded after the component unmounted', () => {
      const node = mount(<ImportIsolatedRemote {...mockProps} />);
      const iframeNode = node.find('iframe').getDOMNode() as HTMLIFrameElement;
      const script = iframeNode.contentWindow!.document.querySelector('script');

      node.unmount();

      expect(script!.onload!).toBeNull();
    });
  });

  describe('onImported()', () => {
    it('triggers onImported when the script has loaded', async () => {
      const onImportedSpy = jest.fn();
      const node = mount(
        <ImportIsolatedRemote {...mockProps} onImported={onImportedSpy} />,
      );

      const iframeNode = node.find('iframe').getDOMNode() as HTMLIFrameElement;
      const script = iframeNode.contentWindow!.document.querySelector('script');
      const callback = script!.onload!;

      callback.call(script, {} as Event);
      expect(onImportedSpy).toBeCalled();
    });

    it('doesnt trigger onImported when the script loads after the component has already been unmounted', () => {
      const onImportedSpy = jest.fn();
      const node = mount(
        <ImportIsolatedRemote {...mockProps} onImported={onImportedSpy} />,
      );

      const iframeNode = node.find('iframe').getDOMNode() as HTMLIFrameElement;
      const script = iframeNode.contentWindow!.document.querySelector('script');

      node.unmount();

      expect(script!.onload!).toBeNull();
      expect(onImportedSpy).not.toBeCalled();
    });
  });

  describe('<iframe />', () => {
    it('renders an iframe', () => {
      const node = shallow(<ImportIsolatedRemote {...mockProps} />);
      expect(node.find('iframe').exists()).toBeTruthy();
    });
  });
});
