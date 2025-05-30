import React from 'react';
import {useFormik} from "formik";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

import Input from "@/shared/ui/Input/Input.jsx";

import {useLogin} from "@/entities/Auth/Auth.module.js";

import {userStorage} from "@/shared/lib/storage.js";

const Login = () => {
  const navigate = useNavigate()
  const {values, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    onSubmit(values) {
      mutate.mutate({
        login: values.login,
        password: values.password,
      })
    }
  })
  
  const onSuccess = async () => {
    await navigate("/cabinet")
    userStorage.save(values.login)
  }
  const onError = (error) => {
    toast.error(error)
  }
  const mutate = useLogin({onSuccess, onError})

  return (
    <>
      <div className={"w-full h-screen flex items-center justify-center"}>
        <div className={"bg-white max-w-sm w-full border border-primary rounded-xl p-6"}>
          <p className={"text-center text-lg font-semibold mb-8"}>Авторизация</p>
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
            <button
              type="submit"
              disabled={mutate.isPending || !values.login || !values.password}
              className="text-center w-full inline-block bg-green-900 cursor-pointer rounded text-white transition-all disabled:bg-gray-700 hover:bg-primary py-2 px-2 mt-4"
            >
              Войти
            </button>
          </form>
          <div className={"text-center text-gray-700"}>
            У вас нет аккаунта? <Link to={"/register"} className={"text-green-900"}>Зарегистрироваться</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;