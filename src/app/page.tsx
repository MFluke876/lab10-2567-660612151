"use client";

import UserCard from "@/components/UserCard";
import { cleanUser } from "@/libs/cleanUser";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

export default function RandomUserPage() {
  // annotate type for users state variable
  const [users, setUsers] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState(1);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    const jsonStr = JSON.stringify(genAmount);
    localStorage.setItem("gen", jsonStr);
  },[genAmount]);

  useEffect(() => {
    const jsonStr = localStorage.getItem("gen");
    if (jsonStr !== null) {
      const newGens = JSON.parse(jsonStr);
      setGenAmount(newGens);
    }
  },[]);

  const generateBtnOnClick = async () => {
    setIsLoading(true);
    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results;

    //Your code here
    //Process result from api response with map function. Tips use function from /src/libs/cleanUser
    //Then update state with function : setUsers(...)


    const cleanedUser = users.map((user: any)=> cleanUser(user));

    setUsers(cleanedUser);

    
  };

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(e) => setGenAmount(parseInt(e.target.value))}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users && !isLoading && users.map((user: any) => (
        <UserCard key={user.email} {...user} />
      ))}

    </div>
  );
}
