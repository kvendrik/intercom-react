export default function classNames(...classes: string[]) {
  return classes.filter((className: string) => className).join(' ');
}
