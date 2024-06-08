import {ChangeEvent, MouseEvent, useState} from "react";
import Validation from "../../../../validation/validation.ts";
import {Link} from "react-router-dom";
import {Path} from "../../../../main.tsx";


const Login = () => {
  enum InputName {
    EMAIL = 'email',
    PASSWORD = 'password',
  }

  const INITIAL_VALIDATION_OBJECT = {
      isValid: false,
      error: '',
      value: '',
      isDirty: false,
  }

  const [form , setForm] = useState({
      email: INITIAL_VALIDATION_OBJECT,
      password: INITIAL_VALIDATION_OBJECT
  })

  const formValidation = {
      [InputName.EMAIL]: (value: string) => {
          return new Validation(value)
              .isRequired()
              .isEmail();
      },
      [InputName.PASSWORD]: (value: string) => {
          return new Validation(value)
              .isRequired()
              .hasMinLength(6)
              .hasMaxLength(20);
      }
  }

  const isFormValid = Object.values(form).every((input) => input.isValid)

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
      const { name  , value } = e.target;
      const newValue = formValidation[name as InputName](value);

      console.log({name, value, newValue})

      setForm({
          ...form,
          [name]: newValue
      })
  }

  const onSubmitForm = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      if (!isFormValid) return;
      event.preventDefault();
      console.log('login')
      //login check here
  }

  return (
      <>
          <h1>Login</h1>
          <form style={{flexDirection: 'column', display: 'flex'}}>
              <input type="email" name={InputName.EMAIL} onChange={onChangeInput} placeholder="Email"/>
              <input type="password" name={InputName.PASSWORD} onChange={onChangeInput} placeholder="Password"/>
              <button type="submit"
                  onClick={(event) => onSubmitForm(event)}
                  disabled={!isFormValid}
              >
                  Login
              </button>
          </form>
          <span>Don't have an account? <Link to={Path.REGISTER}>Register</Link></span>
      </>
  );
};

export default Login;
