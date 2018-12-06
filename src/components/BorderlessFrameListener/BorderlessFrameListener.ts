import * as React from 'react';

export interface BorderlessFrameSizes {
  width: string;
  height: string;
}

export interface Props {
  frame: HTMLIFrameElement;
  launcher: boolean;
  onSizesUpdate(newSizes: BorderlessFrameSizes): void;
}

const LAUNCHER_SIZE_PIXELS = 60;
const LAUNCHER_MARGIN_PIXELS = 20;

class BorderlessFrameListener extends React.Component<Props, never> {
  private observer: MutationObserver = this.getObserver(
    this.props.frame,
    this.props.onSizesUpdate,
  );

  componentWillMount() {
    this.injectCustomStyles();
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  render() {
    return null;
  }

  private injectCustomStyles() {
    const {
      frame: {contentWindow},
    } = this.props;

    const node = document.createElement('style');

    node.innerHTML = `
      .intercom-gradient {
        width: 100% !important;
        height: 100% !important;
      }
    `;

    contentWindow!.document.head!.appendChild(node);
  }

  private getObserver(
    frame: HTMLIFrameElement,
    onSizesUpdate: Props['onSizesUpdate'],
  ) {
    const {launcher} = this.props;
    const frameBody = frame.contentWindow!.document.body;

    const observer = new MutationObserver(mutations => {
      for (const {target} of mutations) {
        const node = target as HTMLIFrameElement;

        if (
          !node.classList.contains('intercom-borderless-frame') &&
          !node.classList.contains('intercom-notifications-frame')
        ) {
          continue;
        }

        const {
          style: {height},
          offsetWidth,
        } = node;

        const finalWidth = launcher
          ? offsetWidth + LAUNCHER_MARGIN_PIXELS
          : offsetWidth;
        let finalHeight = height || '0px';

        if (height && launcher) {
          finalHeight = addMarginToPixels(
            height,
            LAUNCHER_SIZE_PIXELS + LAUNCHER_MARGIN_PIXELS * 2,
          );
        }

        onSizesUpdate({
          width: `${finalWidth}px`,
          height: finalHeight,
        });
      }
    });

    observer.observe(frameBody, {
      attributes: true,
      subtree: true,
    });

    return observer;
  }
}

function addMarginToPixels(pixelsString: string, margin: number) {
  const pixels = Number(pixelsString.replace('px', ''));
  return `${pixels + margin}px`;
}

export default BorderlessFrameListener;
