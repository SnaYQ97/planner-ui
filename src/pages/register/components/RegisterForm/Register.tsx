import {ButtonHTMLAttributes, ChangeEvent, DetailedHTMLProps, MouseEvent, MouseEventHandler, useState} from "react";
import Validation from "../../../../validation/validation.ts";
import UserService, {UserCreation} from "../../../../services/UserService/User.service.ts";
import {Link} from "react-router-dom";
import {Path} from "../../../../main.tsx";


const Register = () => {
  enum InputName {
    EMAIL = 'email',
    PASSWORD = 'password',
    CHECK_PASSWORD = 'check_password'
  }

  const INITIAL_VALIDATION_OBJECT = {
      isValid: false,
      error: '',
      value: '',
      isDirty: false,
  }

  const [form , setForm] = useState({
      inputs: {
          [InputName.EMAIL]: INITIAL_VALIDATION_OBJECT,
          [InputName.PASSWORD]: INITIAL_VALIDATION_OBJECT,
          [InputName.CHECK_PASSWORD]: INITIAL_VALIDATION_OBJECT
      },
      isFormValid: false,
      isLoading: false
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
      },
      [InputName.CHECK_PASSWORD]: (value: string) => {
          return new Validation(value)
              .isRequired()
              .hasMinLength(6)
              .hasMaxLength(20)
              .customCheck( () => value === form.inputs[InputName.PASSWORD].value, 'Passwords have to be identical')
      },
  }

  const isFormValid = Object.values(form.inputs).every((input) => input.isValid)

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
      const { name  , value } = e.target;
      const newValue = formValidation[name as InputName](value);

      console.log({name, value, newValue})

      setForm({
          ...form,
          inputs: {
              ...form.inputs,
              [name]: newValue
          },
          isFormValid: isFormValid,
      })
  }

  const onSubmitForm = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      if (!isFormValid) return;
      console.log('register')

      const user: UserCreation = {
          email: form.inputs[InputName.EMAIL].value,
          password: form.inputs[InputName.PASSWORD].value
      }
      event.preventDefault();
      setForm({ ...form, isLoading: true })
      try {
          UserService().createUser(user);
          console.log('User created')
      } catch (error) {
          console.log(error)
      }
      finally {
          setForm({ ...form, isLoading: false })
      }
  }

  return (
      <>
          <h1>Register</h1>
          <form style={{flexDirection: 'column', display: 'flex'}}>
              <input type="email" name={InputName.EMAIL} onChange={onChangeInput} placeholder="Email"/>
              <span>{form.inputs[InputName.EMAIL].error}</span>
              <input type="password" name={InputName.PASSWORD} onChange={onChangeInput} placeholder="Password"/>
              <span>{form.inputs[InputName.PASSWORD].error}</span>
              <input type="password" name={InputName.CHECK_PASSWORD} onChange={onChangeInput} placeholder="Check password"/>
              <span>{form.inputs[InputName.CHECK_PASSWORD].error}</span>

              <button
                  type="submit"
                  onClick={(e) => onSubmitForm(e)}
                  disabled={!isFormValid}
              >
                Register
              </button>
              <span>Already have an account? <Link to={Path.LOGIN} >Sign in</Link></span>
          </form>
      </>
  );
};

export default Register;
