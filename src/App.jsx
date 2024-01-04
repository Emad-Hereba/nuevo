import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "@progress/kendo-theme-bootstrap/dist/all.css"
import { Form, Field, FormElement, FieldWrapper } from '@progress/kendo-react-form';
import { Error } from '@progress/kendo-react-labels';
import { Input } from '@progress/kendo-react-inputs';
import { FormRadioGroup } from './form-components';

const emailRegex = new RegExp(/\S+@\S+\.\S+/);
const emailValidator = value => emailRegex.test(value) ? "" : "Please enter a valid email.";
const EmailInput = fieldRenderProps => {
  const {
    validationMessage,
    visited,
    ...others
  } = fieldRenderProps;
  

  return <div className='k-form-field-wrap'>
      <Input {...others} labelClassName={'k-form-label'} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>;
};
const App = () => {
  const genders = [
    {
      label: "Male",
      value: "male",
    },
    {
      label: "Famale",
      value: "famale",
    },
    {
      label: "Other",
      value: "Other",
    }
  ];

  console.log('genders', genders)

  const handleSubmit = dataItem => alert(JSON.stringify(dataItem, null, 2));
  return <Form onSubmit={handleSubmit} render={formRenderProps => <FormElement style={{
    maxWidth: 650
  }}>
            <fieldset className={'k-form-fieldset'}>
              <legend className={'k-form-legend'}>Please fill in the fields:</legend>
{/*--------------------------------------------------*/}
            <FieldWrapper>
                <div className='k-form-field-wrap'>
                  <Field 
                    name={'Code:'}
                    type={"number"} 
                    style={{
                      width: "20%",
                    }}
                    maxLength={4} 
                    component={Input} 
                    labelClassName={'k-form-label'} 
                    label={'Code:'} 
                  />
                </div>
              </FieldWrapper>

{/*--------------------------------------------------*/}

              <FieldWrapper>
                <div className='k-form-field-wrap'>
                  <Field name={'lastName'}
                    style={{
                      width: "45%",
                    }}
                    type ='text'
                    requiered = ''
                    validationMessage="Name is required"
                    maxLength={30} 
                  component={Input} 
                  labelClassName={'k-form-label'} 
                  label={'name:'}
                  />
                </div>
              </FieldWrapper>
{/*--------------------------------------------------*/}
              <FieldWrapper>
                <Field 
                name={"email"}
                style={{
                  width: "50%",
                }}
                maxLength={40} 
                type={"email"} 
                component={EmailInput} 
                label={"Email"} 
                validator={emailValidator} 
                />
              </FieldWrapper>
{/*--------------------------------------------------*/}

<Field
            id={"gender"}
            name={"gender"}
            label={"Gender"}
            layout={"horizontal"}
            component={FormRadioGroup}
            data={genders}
          />
{/*--------------------------------------------------*/}

            </fieldset>
            <div className="k-form-buttons">
              <button type={'submit'} className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" disabled={!formRenderProps.allowSubmit}>
                Submit
              </button>
            </div>
          </FormElement>} />;
};
export default App;