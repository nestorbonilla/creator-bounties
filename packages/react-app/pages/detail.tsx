import { useContract,
  useAccount,
   useProvider,
   useContractWrite,
   usePrepareContractWrite,
   useContractRead,
   useWaitForTransaction } from 'wagmi'
import { useState, useEffect } from 'react';
import ERC721PoolFactoryABI from "../utils/ERC721PoolFactoryABI.json";
import ERC721PoolABI from "../utils/ERC721PoolABI.json";
import { Londrina_Solid } from "@next/font/google";

const Londrina = Londrina_Solid({
subsets: ["latin"],
weight: "400"
});

export default function Detail() {

  let [title, setTitle] = useState("");

const bounties = [
{
title: 'Create AR Noun Filter',
description: 'Create an AR noogles filter.',
submissions: '3',
status: 'Open'
},
// More bounties...
]

const { address, isConnected } = useAccount();
const[nftAddress, setNftAddress] = useState("0x932Ca55B9Ef0b3094E8Fa82435b3b4c50d713043");
const[nftTokenIds, setNftTokenIds] = useState([]);

return (
<div>    

</div>
)
}
