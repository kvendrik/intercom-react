export default function injectCustomStyles(
  frame: HTMLIFrameElement,
  styles: string,
) {
  const {contentWindow} = frame;
  const node = document.createElement('style');
  node.innerHTML = styles;
  contentWindow!.document.head!.appendChild(node);
}
