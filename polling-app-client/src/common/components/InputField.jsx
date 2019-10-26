import * as React from "react";
import { FieldProps } from "formik";
import { Form, Input } from "antd";

const FormItem = Form.Item;

export const InputField = ({
           field, // { name, value, onChange, onBlur }
           form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
           ...props
         }) => {
  const errorMsg = touched[field.name] && errors[field.name];

  return (
      <FormItem help={errorMsg} validateStatus={errorMsg ? "error" : undefined} required={props.required} label={props.placeholder}>
        <Input {...field} {...props} />
      </FormItem>
  );
};