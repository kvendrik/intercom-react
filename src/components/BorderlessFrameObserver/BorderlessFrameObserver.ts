import * as React from 'react';
import {bind} from 'lodash-decorators';
import {injectCustomStyles} from '../../utilities';

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

class BorderlessFrameObserver extends React.Component<Props, never> {
  private observer: MutationObserver | null = null;

  componentWillMount() {
    const {frame} = this.props;
    this.observeNode(
      frame.contentWindow!.document.body,
      this.handleBodyMutation,
      {
        childList: true,
      },
    );
    this.injectCustomGradientStyles();
  }

  componentWillUnmount() {
    this.cleanObserver();
  }

  render() {
    return null;
  }

  private injectCustomGradientStyles() {
    const {frame} = this.props;
    injectCustomStyles(
      frame,
      `
    .intercom-gradient {
      width: 100% !important;
      height: 100% !important;
    }
  `,
    );
  }

  private observeNode(
    nodeToObserve: HTMLElement,
    onMutation: (mutations: MutationRecord[]) => void,
    options: MutationObserverInit,
  ) {
    this.cleanObserver();

    const observer = new MutationObserver(onMutation);
    observer.observe(nodeToObserve, options);

    this.observer = observer;
    return observer;
  }

  private cleanObserver() {
    const {observer} = this;
    if (observer) {
      observer.disconnect();
    }
  }

  @bind()
  private handleBodyMutation([{target: body}]: MutationRecord[]) {
    const intercomAppNode = (body as HTMLElement).querySelector(
      '.intercom-app',
    );
    this.observeNode(
      intercomAppNode as HTMLElement,
      this.handleIntercomAppMutation,
      {
        attributes: true,
        subtree: true,
      },
    );
  }

  @bind()
  private handleIntercomAppMutation(mutations: MutationRecord[]) {
    const {launcher, onSizesUpdate} = this.props;

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

      return;
    }
  }
}

function addMarginToPixels(pixelsString: string, margin: number) {
  const pixels = Number(pixelsString.replace('px', ''));
  return `${pixels + margin}px`;
}

export default BorderlessFrameObserver;
