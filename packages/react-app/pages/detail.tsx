import { useContract,
  useAccount,
   useProvider,
   useContractWrite,
   usePrepareContractWrite,
   useContractRead,
   useWaitForTransaction } from 'wagmi'
import { useState, useEffect } from 'react';
import poolFactoryABI from "../../../utils/poolFactoryABI.json";
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

const { data: useContractReadPoolCreate } = useContractRead({
address: '0xC924C92e49996066363292dB5B31A79a4f658753',
abi: poolFactoryABI,
functionName: 'getPool',
args: [nftAddress]
});

const { data: useContractReadPoolDeposit } = useContractRead({
address: '0xC924C92e49996066363292dB5B31A79a4f658753',
abi: poolFactoryABI,
functionName: 'balanceOf',
args: [address]
});

const { config: configPoolCreate } = usePrepareContractWrite({
address: '0xC924C92e49996066363292dB5B31A79a4f658753',
abi: poolFactoryABI,
functionName: 'createPool',
args: [nftAddress]
});

const { config: configPoolDeposit } = usePrepareContractWrite({
address: '0xC924C92e49996066363292dB5B31A79a4f658753',
abi: poolFactoryABI,
functionName: 'deposit',
args: [nftTokenIds]
});



// POOL CREATION
const {data : dPoolCreate , write: wPoolCreate } = useContractWrite(configPoolCreate);
const {data : useWaitForPoolCreate, isSuccess: poolCreateSuccess} = useWaitForTransaction({
hash: dPoolCreate?.hash
});

// POOL DEPOSIT
const {data : dPoolDeposit , write: wPoolDeposit } = useContractWrite(configPoolDeposit);
const {data : useWaitForPoolDeposit, isSuccess: poolDepositSuccess} = useWaitForTransaction({
hash: dPoolDeposit?.hash
});

useEffect(() => {
console.log("__________________________");
console.log("Pool Create");
console.log("useContractReadData", useContractReadPoolCreate);
console.log("Pool Deposit");
console.log("useContractReadData", useContractReadPoolDeposit);
console.log("Pool Create");
console.log("useContractWriteData:", dPoolCreate);
console.log("useWaitForTransactionData:", useWaitForPoolCreate);
console.log("Pool Deposit");
console.log("useContractWriteData:", dPoolDeposit);
console.log("useWaitForTransactionData:", useWaitForPoolDeposit);
console.log("__________________________");
}, [useContractReadPoolCreate, useContractReadPoolDeposit, dPoolCreate, useWaitForPoolCreate, dPoolDeposit, useWaitForPoolDeposit]);

return (
<div>    
<div className="bg-white py-8 px-4 border border-onyx sm:px-10">
                          <form className="space-y-6" onSubmit={event => {
                            event.preventDefault();
                            
                          }}>
                            <div>
                              <label htmlFor="address" className="block text-sm font-medium text-onyx">
                                Address (public key)
                              </label>
                              <div className="mt-1">
                                <input
                                  id="address"
                                  name="address"
                                  type="text"
                                  autoComplete="address"
                                  required
                                  value={address}
                                  disabled={true}
                                  className="block w-full appearance-none border border-onyx px-3 py-2 bg-gypsum text-wood focus:border-forest focus:outline-none focus:ring-forest sm:text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="identifierType" className="block text-sm font-medium text-onyx">
                                Identifier type
                              </label>
                              <div className="mt-1">
                                <input
                                  id="identifierType"
                                  name="identifierType"
                                  type="text"
                                  autoComplete="identifierType"
                                  required
                                  value={"GitHub"}
                                  disabled={true}
                                  className="block w-full appearance-none border border-onyx px-3 py-2 bg-gypsum text-wood focus:border-forest focus:outline-none focus:ring-forest sm:text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="identifier" className="block text-sm font-medium text-onyx">
                                Identifier
                              </label>
                              <div className="mt-1">
                                <input
                                  id="identifier"
                                  name="identifier"
                                  type="text"
                                  autoComplete="identifier"
                                  required
                                  value={title}
                                  disabled={true}
                                  className="block w-full appearance-none border border-onyx px-3 py-2 bg-gypsum text-wood focus:border-forest focus:outline-none focus:ring-forest sm:text-sm"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col mx-auto content-center">
                            <button
                              type={"submit"}
                              className={`${Londrina.className} block rounded-md bg-white py-2 px-3 text-center text-sm font-semibold text-nred shadow-sm hover:bg-nyellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
                            >
                              Create
                            </button>                     
                            </div>
                          </form>                        
                        </div>
</div>
)
}
