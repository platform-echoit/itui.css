export { Input } from './Input';
export type { InputProps } from './Input';

// The entry point: <InputV2 fieldType="phone" … />. Its props are a union
// discriminated by `fieldType`, so each field keeps its own typed props.
export { InputV2 } from './InputV2';
export type { InputV2Props, InputV2FieldType } from './InputV2';

// The field types behind it, exported for callers who prefer a direct import.
// (InputFieldShell stays internal — it is a building block, not a component.)
export { InputText } from './InputText';
export type { InputTextProps } from './InputText';
export { InputSearch } from './InputSearch';
export type { InputSearchProps } from './InputSearch';
export { InputPhoneNumber } from './InputPhoneNumber';
export type { InputPhoneNumberProps } from './InputPhoneNumber';
export { InputWithButton } from './InputWithButton';
export type { InputWithButtonProps } from './InputWithButton';
export { InputDate } from './InputDate';
export type { InputDateProps } from './InputDate';
export {
  InputDropdown,
  InputDropdownItem,
  InputDropdownSub,
} from './InputDropdown';
export type {
  InputDropdownProps,
  InputDropdownItemProps,
  InputDropdownSubProps,
} from './InputDropdown';
export { InputTag } from './InputTag';
export type { InputTagProps } from './InputTag';
export { InputTextarea } from './InputTextarea';
export type { InputTextareaProps } from './InputTextarea';
export { InputTextFormatting } from './InputTextFormatting';
export type {
  InputTextFormattingProps,
  InputTextFormattingCommand,
} from './InputTextFormatting';
export { InputFileUpload, InputFileUploadItem } from './InputFileUpload';
export type {
  InputFileUploadProps,
  InputFileUploadItemProps,
  InputFileUploadItemData,
  InputFileUploadStatus,
} from './InputFileUpload';
