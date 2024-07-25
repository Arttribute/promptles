"use client";

import { useState, useEffect } from "react";

import { User } from "@/models/User";

import AppBar from "@/components/layout/appbar";
import PromptsForm from "@/components/create/prompts-form";
import RequireAuthPlaceholder from "@/components/account/require-auth-placeholder";

export default function Create() {
  const [loaded, setLoaded] = useState(false);
  const [loadedAccount, setLoadedAccount] = useState(true);
  const [account, setAccount] = useState<User | null>(null);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    setLoadedAccount(true);
    setAccount(user);
  }, [loaded]);
  return (
    <div>
      <AppBar />

      <div className="flex flex-col items-center justify-center mt-16">
        {account != null ? <PromptsForm /> : null}

        {loadedAccount && !account ? (
          <div className=" mt-12">
            <RequireAuthPlaceholder />{" "}
          </div>
        ) : null}
      </div>
    </div>
  );
}
