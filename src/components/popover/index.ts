// Named re-exports — see I-27 and the note in `../select/index.ts`. Only
// `PopoverMenu` is a client module here; `Popover` and `PopoverPanel` are
// deliberately server-safe (I-13c), and `export *` was throwing that away by
// making the whole barrel client.
export {
  Popover,
  PopoverRoot,
  PopoverTrigger,
  PopoverAnchor,
  PopoverPortal,
  PopoverClose,
  PopoverContent,
} from './Popover';
export type {
  PopoverProps,
  PopoverAnchorProps,
  PopoverPlacement,
  PopoverContentProps,
} from './Popover';

export { PopoverMenu } from './PopoverMenu';
export type { PopoverMenuProps } from './PopoverMenu';

export {
  PopoverPanel,
  PopoverHeader,
  PopoverGroup,
  PopoverSeparator,
  PopoverItem,
} from './PopoverPanel';
export type {
  PopoverPanelProps,
  PopoverHeaderProps,
  PopoverGroupProps,
  PopoverSeparatorProps,
  PopoverItemProps,
} from './PopoverPanel';
