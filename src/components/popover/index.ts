// Named re-exports — see I-27 and the note in `../select/index.ts`. Only
// `PopoverMenu` is a client module here; `Popover` and `PopoverRoot` are
// deliberately server-safe (I-13c), and `export *` was throwing that away by
// making the whole barrel client.
export {
  Popover,
  PopoverHeader,
  PopoverGroup,
  PopoverSeparator,
  PopoverItem,
} from './Popover';
export type {
  PopoverProps,
  PopoverHeaderProps,
  PopoverGroupProps,
  PopoverSeparatorProps,
  PopoverItemProps,
} from './Popover';

export { PopoverMenu } from './PopoverMenu';
export type { PopoverMenuProps } from './PopoverMenu';

export {
  PopoverRoot,
  PopoverTrigger,
  PopoverAnchor,
  PopoverPortal,
  PopoverClose,
  PopoverContent,
} from './PopoverRoot';
export type {
  PopoverAnchorProps,
  PopoverPlacement,
  PopoverContentProps,
} from './PopoverRoot';
