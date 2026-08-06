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

    <InputV2 label="이름" />                        ← plain field
    <InputV2 fieldType="phone" label="휴대폰" />     ← 전화번호
    <InputV2 fieldType="date" value={d} onValueChange={setD} />

  `fieldType` rather than `variant`: elsewhere in this library `variant` picks a
  look for one component, while here it picks which field is rendered — the
  props and the shape of `value` change with it. It is also not the native
  `type` attribute, which stays available on the single-line field
  (`<InputV2 type="password" />`).

  Each field keeps its own props: `fieldType="date"` type-checks against
  InputDateProps, `fieldType="tag"` against InputTagProps, and so on. The
  underlying components are exported too, for when a caller prefers importing
  one directly.
*/

export type InputV2FieldType =
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

/** Props of `InputV2` — a union discriminated by `fieldType`. */
export type InputV2Props =
  | ({
      /**
       * Which field to render. It is the discriminant of this union, so setting
       * it narrows the rest of the props to that field's own — omit it and you
       * get the plain single-line field.
       */
      fieldType?: 'text';
    } & InputTextProps)
  | ({ fieldType: 'search' } & InputSearchProps)
  | ({ fieldType: 'phone' } & InputPhoneNumberProps)
  | ({ fieldType: 'date' } & InputDateProps)
  | ({ fieldType: 'dropdown' } & InputDropdownProps)
  | ({ fieldType: 'tag' } & InputTagProps)
  | ({ fieldType: 'textarea' } & InputTextareaProps)
  | ({ fieldType: 'button' } & InputWithButtonProps)
  | ({ fieldType: 'upload' } & InputFileUploadProps)
  | ({ fieldType: 'text-formatting' } & InputTextFormattingProps);

/**
 * The input every screen reaches for: one import, one `fieldType` prop.
 *
 * The forwarded ref lands on the field's own control — a `<textarea>` for
 * `fieldType="textarea"`, an `<input>` for every other field type.
 */
export const InputV2 = forwardRef<
  // HTMLDivElement is here for `fieldType="text-formatting"` alone — Lexical's
  // editable surface is a contenteditable <div>, not a form control.
  HTMLInputElement | HTMLTextAreaElement | HTMLDivElement,
  InputV2Props
>((props, ref) => {
  // Each branch narrows the union, so a field's props are checked against that
  // field alone. Only the ref needs a cast — TS cannot narrow it along with props.
  switch (props.fieldType) {
    case 'search': {
      const { fieldType: _fieldType, ...rest } = props;
      return <InputSearch ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
    case 'phone': {
      const { fieldType: _fieldType, ...rest } = props;
      return <InputPhoneNumber ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
    case 'date': {
      const { fieldType: _fieldType, ...rest } = props;
      return <InputDate ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
    case 'dropdown': {
      const { fieldType: _fieldType, ...rest } = props;
      return <InputDropdown ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
    case 'tag': {
      const { fieldType: _fieldType, ...rest } = props;
      return <InputTag ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
    case 'textarea': {
      const { fieldType: _fieldType, ...rest } = props;
      return <InputTextarea ref={ref as Ref<HTMLTextAreaElement>} {...rest} />;
    }
    case 'button': {
      const { fieldType: _fieldType, ...rest } = props;
      return <InputWithButton ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
    case 'upload': {
      const { fieldType: _fieldType, ...rest } = props;
      // The ref lands on the hidden <input type="file">.
      return <InputFileUpload ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
    case 'text-formatting': {
      const { fieldType: _fieldType, ...rest } = props;
      return <InputTextFormatting ref={ref as Ref<HTMLDivElement>} {...rest} />;
    }
    default: {
      const { fieldType: _fieldType, ...rest } = props;
      return <InputText ref={ref as Ref<HTMLInputElement>} {...rest} />;
    }
  }
});

InputV2.displayName = 'InputV2';
