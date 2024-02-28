import { useSearchParams, Link } from "react-router-dom";
import classNames from "classnames";
import React from "react";
import { useUsers } from "../store/UsersContext";

type Param = string | number;
type Params = {
  [key: string]: Param[] | Param | null;
};

function getSearchWith(params: Params, search?: string | URLSearchParams) {
  const newParams = new URLSearchParams(search);

  for (const [key, value] of Object.entries(params)) {
    if (value === null) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.delete(key);
      value.forEach((item) => newParams.append(key, item.toString()));
    } else {
      newParams.set(key, value.toString());
    }
  }

  return newParams.toString();
}

export const PostFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const users = useUsers();
  const query = searchParams.get("query") || "";
  const letters = searchParams.getAll("letters") || [];
  const userId = +(searchParams.get("userId") || 0);

  function setSearchWith(params: any) {
    const search = getSearchWith(params, searchParams);
    setSearchParams(search);
  }

  function handlePageChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSearchWith({ userId: +event.target.value || null });
  }

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchWith({ query: event.target.value || null });
  }

  // function toggleLetter(ch: string) {
  //   const newLetters = letters.includes(ch)
  //     ? letters.filter((letter) => letter !== ch)
  //     : [...letters, ch];
  //   setSearchWith({ letters: newLetters });
  // }

  function toggleLetter(letter: string) {
    const newLetters = letters.includes(letter)
      ? letters.filter((ch) => letter !== ch)
      : [...letters, letter];
    
    return newLetters;
  }

  // function clearLetters() {
  //   setSearchWith({ letters: null });
  // }

  return (
    <div className="block">
      <div className="field is-grouped">
        <div className="select">
          <select value={userId} onChange={handlePageChange}>
            <option value="0">All users</option>

            {users.map((user) => (
              <option value={user.id} key={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <input
          type="search"
          className="input"
          placeholder="Search by title"
          value={query}
          onChange={handleQueryChange}
        />
      </div>

      <div className="buttons">
        {"aeoui".split("").map((letter) => (
          <Link
            key={letter}
            to={{
              search: getSearchWith({ letters: toggleLetter(letter) }, searchParams),
            }}
            className={classNames("button", {
              "is-info": letters.includes(letter),
            })}
          >
            {letter}
          </Link>
        ))}

        <Link
          to={{ search: getSearchWith({ letters: null }, searchParams) }}
          className="button"
        >
          Clear
        </Link>
      </div>
    </div>
  );
};
