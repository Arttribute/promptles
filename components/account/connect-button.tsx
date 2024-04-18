"use client";
import { useCallback, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { User } from "@/models/User";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

interface Props {
  action: "Connect account" | "Disconnect";
  buttonVariant?: "ghost" | "outline" | "default";
  setAccount: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function ConnectButton({
  action,
  setAccount,
  buttonVariant,
}: Props) {
  const [disabled, setDisabled] = useState(false);

  const postConnect = async (account: string, email?: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ web3Address: account, email }),
    });
    if (res.ok) {
      console.log("Connected to server");
    } else {
      console.error("Failed to connect to server");
    }

    const data = await res.json();
    return data;
  };

  const connect = useCallback(async () => {
    try {
      setDisabled(true);

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const email = address; //TODO: get email from user
      const data = await postConnect(address, email);
      console.log("User Data", data);

      localStorage.setItem("user", JSON.stringify(data));
      setAccount(data);
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  }, [setAccount]);

  const disconnect = useCallback(async () => {
    try {
      setDisabled(true);
      localStorage.removeItem("user");
      setDisabled(false);
      setAccount(null);
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  }, [setAccount]);

  return (
    <>
      <Button
        variant={buttonVariant || "ghost"}
        size="sm"
        disabled={disabled}
        onClick={action == "Connect account" ? connect : disconnect}
        className="rounded-lg px-8 font-semibold"
      >
        <p
          className={
            action == "Connect account"
              ? "bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
              : "font-medium"
          }
        >
          {disabled ? (
            <Loader2 className="mx-auto h-4 w-4 animate-spin text-indigo-700" />
          ) : (
            action
          )}
        </p>
      </Button>
    </>
  );
}
