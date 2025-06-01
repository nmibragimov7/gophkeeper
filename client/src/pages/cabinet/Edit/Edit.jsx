import React, {useEffect, useState} from 'react';
import toast from "react-hot-toast";
import {useFormik} from "formik";
import {useLocation, useNavigate} from "react-router-dom";

import Input from "@/shared/ui/Input/Input.jsx";

import {useUpdateSecret} from "@/entities/Secret/Secret.module.js";

const initialCard = {
  number: "",
  month: "",
  year: "",
  fullName: "",
  cvv: "",
}

const Edit = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [card, setCard] = useState(initialCard)
  const [file, setFile] = useState(null)

  const onSuccess = async () => {
    toast.success("Данные успешно обновлены")
    await navigate("/cabinet")
  }
  const onError = (error) => {
    toast.error(error)
  }
  const mutate = useUpdateSecret({onSuccess, onError})

  const {values, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      type: "",
      meta: "",
      data: "",
    },
    onSubmit(values) {
      let data = {
        type: values.type,
        meta: values.meta,
      }

      if (values.type === "card") {
        data.data = values.data
      }

      if (values.type === "file" && file && typeof file === "object") {
        data.data = file
      }

      mutate.mutate({id: location.state?.id, data})
    }
  })

  const onChange = (key, value) => {
    setCard(prev => ({...prev, [key]: value}))
  }

  useEffect(() => {
    if (Object.values(card).some(v => v)) {
      setFieldValue("data", `${card.number},${card.month},${card.year},${card.fullName},${card.cvv}`)
    } else {
      setFieldValue("data", "")
    }
  }, [setFieldValue, card])

  useEffect(() => {
    if (!location.state) {
      navigate("/cabinet")
    }
    if (location.state) {
      if (location.state?.type === "card" && location.state?.data) {
        const data = atob(location.state.data)
        if (data && data.split(",").length === 5) {
          const fields = data.split(",")
          setCard({
            number: fields[0],
            month: fields[1],
            year: fields[2],
            fullName: fields[3],
            cvv: fields[4],
          })
          setFieldValue("data", data)
        }
      }
      if (location.state?.type === "file") {
        setFile("secret.txt")
      }

      if (location.state?.type) {
        setFieldValue("type", location.state?.type)
      }
      if (location.state?.meta) {
        setFieldValue("meta", location.state?.meta)
      }
    }
  }, [location])

  return (
    <>
      <div>
        <form onSubmit={handleSubmit} className={"grid gap-8"}>
          <div className={"grid grid-cols-3 gap-4"}>
            <select
              disabled
              value={values.type}
              onChange={(event) => {
                setFieldValue("type", event.target.value)
                setCard(initialCard)
                setFile(null)
              }}
              className={"w-full h-10 rounded border border-solid border-gray-700 bg-gray-100 px-4"}
            >
              <option value="" disabled className={"text-gray-500"}>Выберите тип</option>
              <option value={"card"}>Банковская карта</option>
              <option value={"file"}>Файл</option>
            </select>
            <Input
              label={"Метаданные"}
              value={values.meta}
              onChange={(event) => setFieldValue("meta", event.target.value)}
            />
            <button
              type="submit"
              disabled={
                mutate.isPending
                || !values.type
                || !values.meta
                || (values.type === "card" && !values.data)
                || (values.type === "file" && !file)
              }
              className="text-center w-full inline-block bg-green-900 cursor-pointer rounded text-white transition-all disabled:bg-gray-700 hover:bg-primary py-2 px-2"
            >
              Сохранить
            </button>
          </div>
          <div className={"flex justify-center"}>
            {values.type === "card" ? (
              <div className={"max-w-xl grid gap-4 border border-primary rounded-xl p-6"}>
                <p className={"text-center font-semibold mb-6"}>Заполните данные карты</p>
                <Input
                  label={"Номер карты"}
                  value={card.number}
                  onChange={(event) => onChange("number", event.target.value)}
                />
                <Input
                  label={"Имя карты"}
                  value={card.fullName}
                  onChange={(event) => onChange("fullName", event.target.value)}
                />
                <div className={"grid grid-cols-3 gap-4"}>
                  <Input
                    label={"Месяц"}
                    value={card.month}
                    onChange={(event) => onChange("month", event.target.value)}
                  />
                  <Input
                    label={"Год"}
                    value={card.year}
                    onChange={(event) => onChange("year", event.target.value)}
                  />
                  <Input
                    label={"CVV"}
                    value={card.cvv}
                    onChange={(event) => onChange("cvv", event.target.value)}
                  />
                </div>
              </div>
            ) : null}
            {values.type === "file" ? (
              <div className={"flex flex-col items-center"}>
                <p className={"text-center font-semibold mb-6"}>Загрузите .txt файл</p>
                <input
                  type={"file"}
                  onChange={(event) => {
                    setFile(event.target.files[0])
                  }}
                  accept={"text/plain"}
                  className={"text-center w-[300px] inline-block bg-green-900 cursor-pointer rounded text-white transition-all hover:bg-primary py-2 px-2"}
                />
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </>
  );
};

export default Edit;