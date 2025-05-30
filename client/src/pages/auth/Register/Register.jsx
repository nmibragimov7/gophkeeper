import React from 'react';
import {useFormik} from "formik";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import Input from "@/shared/ui/Input/Input.jsx";

import {useRegister} from "@/entities/Auth/Auth.module.js";

const Register = () => {
  const navigate = useNavigate()
  const {values, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      login: "",
      password: "",
      repeat: "",
    },
    onSubmit(values) {
      mutate.mutate({
        login: values.login,
        password: values.password,
      })
    }
  })

  const onSuccess = async () => {
    toast.success("Регистрация прошла успешно")
    await navigate("/")
  }
  const onError = (error) => {
    toast.error(error)
  }
  const mutate = useRegister({onSuccess, onError})

  return (
    <>
      <div className={"w-full h-screen flex items-center justify-center"}>
        <div className={"bg-white max-w-sm w-full border border-primary rounded-xl p-6"}>
          <p className={"text-center text-lg font-semibold mb-8"}>Регистрация</p>
          <form onSubmit={handleSubmit} className={"grid gap-4 mb-8"}>
            <Input
              label={"Логин"}
              value={values.login}
              onChange={(event) => setFieldValue("login", event.target.value)}
            />
            <Input
              label={"Пароль"}
              type="password"
              value={values.password}
              onChange={(event) => setFieldValue("password", event.target.value)}
            />
            <Input
              label={"Повторить пароль"}
              type="password"
              value={values.repeat}
              onChange={(event) => setFieldValue("repeat", event.target.value)}
            />
            <button
              type="submit"
              disabled={
                mutate.isPending
                || !values.login
                || !values.password
                || !values.repeat
                || values.password !== values.repeat
              }
              className="text-center w-full inline-block bg-green-900 cursor-pointer rounded text-white transition-all disabled:bg-gray-700 hover:bg-primary py-2 px-2 mt-4"
            >
              Подтвердить
            </button>
          </form>
          <div className={"text-center text-gray-700"}>
            Вы уже зарегестрированы? <Link to={"/"} className={"text-green-900"}>Войти</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;