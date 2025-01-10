import {DetailedHTMLProps, FormHTMLAttributes, ForwardedRef, forwardRef} from "react";
import FormRoot from "./Form.styled.ts";

const Form = forwardRef((props:DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, ref: ForwardedRef<HTMLFormElement>)  => {
  const { children, ...other  }  = props;
  return (
    <FormRoot ref={ref}
              {...other}
    >
      {children}
    </FormRoot>
  )
});

export default Form;
