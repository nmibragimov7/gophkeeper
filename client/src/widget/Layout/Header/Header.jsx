import React from 'react';
import {Link, useNavigate} from "react-router-dom";

import {accessTokenStorage, userStorage} from "@/shared/lib/storage.js";

const Header = () => {
  const navigate = useNavigate()

  const user = userStorage.get()

  const onLogout = async () => {
    userStorage.clear()
    accessTokenStorage.clear()
    await navigate("/")
  }

  return (
    <>
      <div className={"bg-white shadow-lg fixed top-0 left-0 w-full"}>
        <div className={"container mx-auto flex items-center justify-between p-4"}>
          <Link to={"/cabinet"} className={"text-green-900 font-bold transition-all hover:opacity-70"}>GOPHKEEPER</Link>
          <div className={"flex items-center gap-5"}>
            <p>{user || "Пользователь"}</p>
            <span
              className={"cursor-pointer transition-all font-bold hover:opacity-70"}
              onClick={onLogout}
            >Выйти</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;