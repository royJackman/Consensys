import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/moving-border";
import { mintNiFTy } from "./contract-connector";

export const NiFTyCard = ({account}: {account: string}) => {
  const randColor = () => Math.floor(Math.random() * 16777215).toString(16);

  const [TLColor, setTLColor] = useState("#" + randColor());
  const [TRColor, setTRColor] = useState("#" + randColor());
  const [BLColor, setBLColor] = useState("#" + randColor());
  const [BRColor, setBRColor] = useState("#" + randColor());

  const onSquareClick = (action: Dispatch<SetStateAction<string>>) =>
    action("#" + randColor());

    const onMintClick = () => mintNiFTy(account, TLColor, TRColor, BLColor, BRColor);

  return (
    <div className="max-w-md overflow-hidden shadow-lg rounded bg-gray-500">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Welcome to the NiFTy NFT</div>
        <p className="text-gray-300 text-base">
          Will you find the rarest of the 4-color NFTs?
        </p>
      </div>
      <div className="grid rounded grid-cols-2 grid-rows-2">
        <div
          className="h-[10vh] flex items-center justify-center select-none"
          onClick={() => onSquareClick(setTLColor)}
          style={{ backgroundColor: TLColor }}
        >
          {TLColor}
        </div>
        <div
          className="h-[10vh] flex items-center justify-center select-none"
          onClick={() => onSquareClick(setTRColor)}
          style={{ backgroundColor: TRColor }}
        >
          {TRColor}
        </div>
        <div
          className="h-[10vh] flex items-center justify-center select-none"
          onClick={() => onSquareClick(setBLColor)}
          style={{ backgroundColor: BLColor }}
        >
          {BLColor}
        </div>
        <div
          className="h-[10vh] flex items-center justify-center select-none"
          onClick={() => onSquareClick(setBRColor)}
          style={{ backgroundColor: BRColor }}
        >
          {BRColor}
        </div>
      </div>
      <div className="text-base flex flex-col items-center p-5">
        <Button onClick={onMintClick}>Mint me!</Button>
      </div>
    </div>
  );
};
