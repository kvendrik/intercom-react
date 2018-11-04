import * as React from 'react';

export interface BorderlessFrameSizes {
  width: string;
  height: string;
}

export interface Props {
  frame: HTMLIFrameElement;
  onSizesUpdate(newSizes: BorderlessFrameSizes): void;
}

const BORDERLESS_FRAME_CLASS = 'intercom-borderless-frame';
const BORDERLESS_FRAME_GRADIENT_CLASS = 'intercom-gradient';

class BorderlessFrameListener extends React.Component<Props, never> {
  private observer: MutationObserver = getObserver(
    this.props.frame,
    this.props.onSizesUpdate,
  );

  componentWillMount() {
    const {
      frame: {contentWindow},
    } = this.props;
    const node = document.createElement('style');
    node.innerHTML = `
      .${BORDERLESS_FRAME_GRADIENT_CLASS} {
        width: 100% !important;
        height: 100% !important;
      }
    `;
    contentWindow!.document.head!.appendChild(node);
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  render() {
    return null;
  }
}

function getObserver(
  frame: HTMLIFrameElement,
  onSizesUpdate: Props['onSizesUpdate'],
) {
  const frameBody = frame.contentWindow!.document.body;

  const observer = new MutationObserver(mutations => {
    for (const {target} of mutations) {
      const node = target as HTMLIFrameElement;
      if (!node.classList.contains(BORDERLESS_FRAME_CLASS)) {
        continue;
      }

      const {
        style: {height},
        offsetWidth,
      } = node;

      onSizesUpdate({
        width: `${offsetWidth}px`,
        height: height || '0px',
      });
    }
  });

  observer.observe(frameBody, {
    attributes: true,
    subtree: true,
  });

  return observer;
}

export default BorderlessFrameListener;
