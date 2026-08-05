// Named re-exports, not `export *` — see I-27. `Select` is a client module, and
// a barrel that cannot state its own exports without evaluating the module turns
// client as a whole, dragging the rest of the library across a consumer's RSC
// boundary. `pnpm check:barrels` keeps this shape from regressing.
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select';
export type { SelectTriggerProps } from './Select';
