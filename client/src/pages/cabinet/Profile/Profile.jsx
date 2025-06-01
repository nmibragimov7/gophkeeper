import React, {useState} from 'react';
import toast from "react-hot-toast";
import {Link} from "react-router-dom";

import Input from "@/shared/ui/Input/Input.jsx";

import {useRemoveSecret, useSecrets} from "@/entities/Secret/Secret.module.js";

import {useDebounce} from "@/shared/hooks/useDebounce.js";
import {formatDate} from "@/shared/lib/date.js";

import editIcon from "@/shared/assets/icons/svg/edit.svg";
import removeIcon from "@/shared/assets/icons/svg/remove.svg";
import downloadIcon from "@/shared/assets/icons/svg/download.svg";

const Profile = () => {
  const [meta, setMeta] = useState("")
  const [value, setValue] = useState("")

  const onSuccess = async () => {
    toast.success("Запись успешно удалена")
    await refetch()
  }
  const onError = (error) => {
    toast.error(error)
  }
  const {data, isFetching, refetch} = useSecrets({meta, onError})
  const remove = useRemoveSecret({onSuccess, onError})

  const callback = (value) => {
    setMeta(value)
  }
  const handler = useDebounce({
    cb: callback,
    delay: 500,
  });
  const onChange = (data) => {
    setValue(data)
    handler(data)
  }
  const onDownload = (data) => {
    const decodedData = atob(data)
    const blob = new Blob([decodedData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "secret.txt"
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className={"flex items-center justify-between gap-4 mb-8"}>
        <Input
          label={"Поиск по метаданным"}
          value={value}
          classNameWrap={"w-full"}
          onChange={(event) => onChange(event.target.value)}
        />
        <Link
          to={"/cabinet/create"}
          className="flex-shrink-0 text-center w-[200px] inline-block bg-green-900 cursor-pointer rounded text-white transition-all hover:bg-primary py-2.5 px-2"
        >
          Добавить запись
        </Link>
      </div>
      <div className={"bg-blue-100 grid grid-cols-6 rounded-lg p-4 mb-4"}>
        <p>Дата обновления</p>
        <p>Тип</p>
        <p>Метаданные</p>
        <p className={"col-span-2"}>Данные</p>
        <p className={"text-center"}>Дествия</p>
      </div>
      {isFetching ? (
        <div className="grow flex items-center justify-center">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {data?.data && data?.data.length ? (
            <div className={"grid gap-4"}>
              {data?.data.map(item => (
                <div key={item?.id} className={"grid grid-cols-6 border border-primary rounded-lg p-4"}>
                  <p>{formatDate(item?.updated_at, "dd.MM.yyyy HH:mm")}</p>
                  <p>{item?.type}</p>
                  <p>{item?.meta}</p>
                  <p className={"col-span-2"}>
                    {item?.type === "card" ? atob(item?.data) : null}
                    {item?.type === "file" ? (
                      <>
                        {item?.data ? (
                          <button
                            className="text-center w-[200px] inline-flex items-center justify-center gap-2 bg-green-900 cursor-pointer rounded text-white transition-all hover:bg-primary py-2 px-2"
                            onClick={() => onDownload(item?.data)}
                          >
                            <img src={downloadIcon} alt="" className={"w-4 h-4"}/>
                            <span>Скачать</span>
                          </button>
                        ) : null}
                      </>
                    ) : null}
                  </p>
                  <div className={"flex items-center justify-center gap-2"}>
                    <Link
                      to={`/cabinet/edit/${item?.id}`}
                      state={item}
                      className={"w-8 h-8 inline-flex items-center justify-center bg-primary cursor-pointer rounded transition-all hover:opacity-70"}
                    >
                      <img src={editIcon} alt="" className={"w-4 h-4"}/>
                    </Link>
                    <button
                      className={"w-8 h-8 inline-flex items-center justify-center bg-red cursor-pointer rounded transition-all disabled:bg-gray-700 hover:opacity-70"}
                      disabled={remove.isPending}
                      onClick={() => remove.mutate(item?.id)}
                    >
                      <img src={removeIcon} alt="" className={"w-4 h-4"}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grow flex items-center justify-center">
              <p className={"text-center"}>Нет записей</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Profile;