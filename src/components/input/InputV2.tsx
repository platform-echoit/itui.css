'use client';

import { forwardRef, type Ref } from 'react';
import { InputText, type InputTextProps } from './InputText';
import { InputSearch, type InputSearchProps } from './InputSearch';
import {
  InputPhoneNumber,
  type InputPhoneNumberProps,
} from './InputPhoneNumber';
import { InputDate, type InputDateProps } from './InputDate';
import { InputDropdown, type InputDropdownProps } from './InputDropdown';
import { InputTag, type InputTagProps } from './InputTag';
import { InputTextarea, type InputTextareaProps } from './InputTextarea';
import { InputWithButton, type InputWithButtonProps } from './InputWithButton';
import { InputFileUpload, type InputFileUploadProps } from './InputFileUpload';
import {
  InputTextFormatting,
  type InputTextFormattingProps,
} from './InputTextFormatting';

/*
  Single entry point for the whole Figma "Input Field" family (node 27096:9858).

    <InputV2 label="이름" />                      ← plain field
    <InputV2 variant="phone" label="휴대폰" />     ← 전화번호
    <InputV2 variant="date" value={d} onValueChange={setD} />

  Each variant keeps its own props: `variant="date"` type-checks against
  InputDateProps, `variant="tag"` against InputTagProps, and so on. The variant
  components are exported too, for when a caller prefers importing one directly.
*/

export type InputV2Variant =
  | 'text'
  | 'search'
  | 'phone'
  | 'date'
  | 'dropdown'
  | 'tag'
  | 'textarea'
  | 'button'
  | 'upload'
  | 'text-formatting';

/** Props of `InputV2` — a union discriminated by `variant`. */
export type InputV2Props =
  | ({ variant?: 'text' } & InputTextProps)
  | ({ variant: 'search' } & InputSearchProps)
  | ({ variant: 'phone' } & InputPhoneNumberProps)
  | ({ variant: 'date' } & InputDateProps)
  | ({ variant: 'dropdown' } & InputDropdownProps)
  | ({ variant: 'tag' } & InputTagProps)
  | ({ variant: 'textarea' } & InputTextareaProps)
  | ({ variant: 'button' } & InputWithButtonProps)
  | ({ variant: 'upload' } & InputFileUploadProps)
  | ({ variant: 'text-formatting' } & InputTextFormattingProps);

/**
 * The input every screen reaches for: one import, one `variant` prop.
 *
 * The forwarded ref lands on the variant's own control — a `<textarea>` for
 * `variant="textarea"`, an `<input>` for every other variant.
 */
export const InputV2 = forwardRef<
  // HTMLDivElement is here for `variant="text-formatting"` alone — Lexical's
  // editable surface is a contenteditable <div>, not a form control.
  HTMLInputElement | HTMLTextAreaElement | HTMLDivElement,
  InputV2Props
>((props, ref) => {
  // Each branch narrows the union, so a variant's props are checked against that
  // variant alone. Only the ref needs a cast — TS cannot narrow it along with props.
  switch (props.variant) {
    case 'search': {
      const { variant: _variant, ...rest } = props;
      return <InputSearch ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
    case 'phone': {
      const { variant: _variant, ...rest } = props;
      return <InputPhoneNumber ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
    case 'date': {
      const { variant: _variant, ...rest } = props;
      return <InputDate ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
    case 'dropdown': {
      const { variant: _variant, ...rest } = props;
      return <InputDropdown ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
    case 'tag': {
      const { variant: _variant, ...rest } = props;
      return <InputTag ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
    case 'textarea': {
      const { variant: _variant, ...rest } = props;
      return <InputTextarea ref={ref as Ref<HTMLTextAreaElement>} {...rest} />;
    }
    case 'button': {
      const { variant: _variant, ...rest } = props;
      return <InputWithButton ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
    case 'upload': {
      const { variant: _variant, ...rest } = props;
      // The ref lands on the hidden <input type="file">.
      return <InputFileUpload ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
    case 'text-formatting': {
      const { variant: _variant, ...rest } = props;
      return <InputTextFormatting ref={ref as Ref<HTMLDivElement>} {...rest} />;
    }
    default: {
      const { variant: _variant, ...rest } = props;
      return <InputText ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
  }
});

InputV2.displayName = 'InputV2';
