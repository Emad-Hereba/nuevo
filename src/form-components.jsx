import * as React from "react";
import { FieldWrapper,Field } from "@progress/kendo-react-form";
import {
  Input,
  MaskedTextBox,
  NumericTextBox,
  Checkbox,
  ColorPicker,
  Switch,
  RadioGroup,
  Slider,
  SliderLabel,
  RangeSlider,
  TextArea,
  Rating,
} from "@progress/kendo-react-inputs";
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  DateRangePicker,
  DateInput,
} from "@progress/kendo-react-dateinputs";
import {
  Label,
  Error,
  Hint,
  FloatingLabel,
} from "@progress/kendo-react-labels";
import {
  DropDownList,
  AutoComplete,
  MultiSelect,
  ComboBox,
  MultiColumnComboBox,
  
} from "@progress/kendo-react-dropdowns";


export const FormRadioGroup = (fieldRenderProps) => {
    const {
      validationMessage,
      touched,
      id,
      label,
      valid,
      disabled,
      hint,
      visited,
      modified,
      ...others
    } = fieldRenderProps;
    const editorRef = React.useRef(null);
    const showValidationMessage = touched && validationMessage;
    const showHint = !showValidationMessage && hint;
    const hintId = showHint ? `${id}_hint` : "";
    const errorId = showValidationMessage ? `${id}_error` : "";
    const labelId = label ? `${id}_label` : "";
    return (
      <FieldWrapper>
        <Label
          id={labelId}
          editorRef={editorRef}
          editorId={id}
          editorValid={valid}
          editorDisabled={disabled}
          className="k-form-label"
        >
          {label}
        </Label>
        <div className={"k-form-field-wrap"}>
          <RadioGroup
            ariaDescribedBy={`${hintId} ${errorId}`}
            ariaLabelledBy={labelId}
            valid={valid}
            disabled={disabled}
            ref={editorRef}
            {...others}
          />
          {showHint && <Hint id={hintId}>{hint}</Hint>}
          {showValidationMessage && (
            <Error id={errorId}>{validationMessage}</Error>
          )}
        </div>
      </FieldWrapper>
    );
  };