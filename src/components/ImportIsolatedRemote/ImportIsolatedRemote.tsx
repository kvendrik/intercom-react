import * as React from 'react';
import Portal from '../Portal';
import * as styles from './ImportIsolatedRemote.scss';

export interface Props {
  title: string;
  source: string;
  onImported(frame: HTMLIFrameElement): void;
}

export default class ImportIsolatedRemote extends React.PureComponent<
  Props,
  never
> {
  private frameNode: React.RefObject<HTMLIFrameElement> = React.createRef();
  private scriptNode: HTMLScriptElement | null = null;

  componentDidMount() {
    const {current: frame} = this.frameNode;
    const {source, onImported} = this.props;

    if (!frame || !frame.contentWindow) {
      return;
    }

    const {contentWindow} = frame;

    const script = document.createElement('script');
    script.src = source;
    this.scriptNode = script;

    function loadScript() {
      contentWindow.document.body.appendChild(script);
      script.onload = () => onImported(frame!);
    }

    // fix for FF which refreshes the content of the iframe
    // when done loading and therefor doesn't support
    // immediately loading the script
    if ((frame.contentDocument as any).readyState === 'uninitialized') {
      frame.onload = loadScript;
      return;
    }

    loadScript();
  }

  componentWillUnmount() {
    const {
      scriptNode,
      frameNode: {current: frame},
    } = this;

    if (frame) {
      frame.onload = null;
    }

    if (scriptNode) {
      scriptNode.onload = null;
    }
  }

  render() {
    const {title} = this.props;
    return (
      <Portal>
        <iframe
          className={styles.ImportIsolatedRemote}
          title={title}
          ref={this.frameNode}
        />
      </Portal>
    );
  }
}
