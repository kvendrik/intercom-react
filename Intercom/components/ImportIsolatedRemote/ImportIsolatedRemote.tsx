import * as React from 'react';
import {Portal} from '..';

export interface Props {
  title: string;
  source: string;
  className?: string;
  onImported(frame: HTMLIFrameElement): void;
}

export default class ImportIsolatedRemote extends React.Component<
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
    script.onload = () => onImported(frame);
    this.scriptNode = script;

    contentWindow.document.body.appendChild(script);
  }

  componentWillUnmount() {
    const {scriptNode} = this;
    if (!scriptNode) {
      return;
    }
    scriptNode.onload = null;
  }

  render() {
    const {title, className} = this.props;
    return (
      <Portal>
        <iframe className={className} title={title} ref={this.frameNode} />
      </Portal>
    );
  }
}
