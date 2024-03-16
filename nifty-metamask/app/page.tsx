"use client";
import { TypewriterEffect } from "./components/ui/typewriter-effect";
import MetaMaskOnboarding from "@metamask/onboarding";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { NiFTyCard } from "./components/NFT/NiFTy-card";

declare global {
  interface Window {
    ethereum: any;
  }
}

const WORDS = [
  { text: "Build" },
  { text: "the" },
  { text: "future", className: "font-mono" },
  { text: "with" },
  { text: "Consensys", className: "text-[#BFFE28] dark:text-[#BFFE28]" },
];

export default function Home() {
  const [isDisabled, setDisabled] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const onboarding = useRef<MetaMaskOnboarding>();

  const handleNewAccounts = (newAccounts: SetStateAction<string[]>) => setAccounts(newAccounts);

  useEffect(() => {
    if (!onboarding.current) {
      if (MetaMaskOnboarding.isMetaMaskInstalled()) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then(handleNewAccounts);
        window.ethereum.on("accountsChanged", handleNewAccounts);
        return () =>
          window.ethereum.removeListener("accountsChanged", handleNewAccounts);
      } else {
        onboarding.current = new MetaMaskOnboarding(); // Create onboarding ref object
      }
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        onboarding.current?.stopOnboarding(); // Disable onboarding once MetaMask installation is confirmed
      }
      setDisabled(accounts.length > 0);
    }
  }, [accounts]);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleNewAccounts);
    } else {
      onboarding.current?.startOnboarding();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[40rem] ">
      <p className="text-neutral-600 dark:text-neutral-200 text-base  mb-10">
        The road to freedom starts from here
      </p>
      <TypewriterEffect words={WORDS} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
        {accounts.length <= 0 ? (
          <button
            disabled={isDisabled}
            onClick={onClick}
            className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm"
          >
            Connect to MetaMask
          </button>
        ) : (
          <NiFTyCard account={accounts[0]}/>
        )}
      </div>
    </div>
  );
}
