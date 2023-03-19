import { useContract,
        useAccount,
         useProvider,
         useContractWrite,
         usePrepareContractWrite,
         useContractRead,
         useWaitForTransaction } from 'wagmi'
import { useState, useEffect } from 'react';
import { Londrina_Solid } from "@next/font/google";
import ERC721PoolFactoryABI from "../utils/ERC721PoolFactoryABI.json";
import ERC721PoolABI from "../utils/ERC721PoolABI.json";
const { BigNumber } = require('ethers');

const Londrina = Londrina_Solid({
  subsets: ["latin"],
  weight: "300"
});

export default function Home() {

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
  const[nftTokenIds, setNftTokenIds] = useState([1]);

  // Get pool address from a specific collection
  // If none, then we need to create one to deposit any ERC721
  const { data: useContractReadPoolAddress } = useContractRead({
    address: '0xC924C92e49996066363292dB5B31A79a4f658753',
    abi: ERC721PoolFactoryABI,
    functionName: 'getPool',
    args: [nftAddress]
  });

  // Get pool ERC20 balance for connected wallet
  const { data: useContractReadPoolBalance } = useContractRead({
    address: useContractReadPoolAddress,
    abi: ERC721PoolABI,
    functionName: 'balanceOf',
    args: [nftAddress]
  });

  // Prepare write to create pool
  const { config: configPoolCreate } = usePrepareContractWrite({
    address: '0xC924C92e49996066363292dB5B31A79a4f658753',
    abi: ERC721PoolFactoryABI,
    functionName: 'createPool',
    args: [nftAddress],
    enabled: false
  });

  // Prepare write to deposit nft in pool
  const { config: configPoolDeposit } = usePrepareContractWrite({
    address: useContractReadPoolAddress,
    abi: ERC721PoolABI,
    functionName: 'deposit',
    args: [nftTokenIds],
    enabled: true
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
    console.log("pool address");
    console.log("useContractReadData", useContractReadPoolAddress);
    console.log("pool balance for current wallet");
    console.log("useContractReadData", parseFloat(BigNumber.from(useContractReadPoolBalance).toString()) );
    console.log("");
    console.log("__________________________");
    console.log("Pool Create");
    console.log("useContractWriteData:", dPoolCreate);
    console.log("useWaitForTransactionData:", useWaitForPoolCreate);
    console.log("Pool Deposit");
    console.log("useContractWriteData:", dPoolDeposit);
    console.log("useWaitForTransactionData:", useWaitForPoolDeposit);
    console.log("__________________________");
}, [useContractReadPoolAddress, useContractReadPoolBalance, dPoolCreate, useWaitForPoolCreate, dPoolDeposit, useWaitForPoolDeposit]);

  return (
    <div>
      
      <div>
        {/* If address is either zero or undefined then wallet can create a pool for the specific nft collection  */}
        {/* {(useContractReadPoolAddress == ("0x0000000000000000000000000000000000000000" || undefined)) && ( */}
        <div class="container py-5 px-10 mx-0 min-w-full flex flex-col items-center">
            <button
              type="button"
              disabled={!wPoolCreate} onClick={() => wPoolCreate?.()}
              className={`${Londrina.className} block rounded-md bg-white py-3 px-5 text-center text-2xl font-semibold text-nred shadow-sm hover:bg-nyellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
            >
              Create Pool
            </button>
          </div>
        {/* )} */}

        {(useContractReadPoolAddress != ("0x0000000000000000000000000000000000000000" || undefined)) && useContractReadPoolBalance && (parseFloat(BigNumber.from(useContractReadPoolBalance).toString()) == 0.0) && (
          <div class="container py-5 px-10 mx-0 min-w-full flex flex-col items-center">
            <button
              type="button"
              disabled={!wPoolDeposit} onClick={() => wPoolDeposit?.()}
              className={`${Londrina.className} block rounded-md bg-white py-3 px-5 text-center text-2xl font-semibold text-nred shadow-sm hover:bg-nyellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
            >
              Deposit NFT
            </button>
          </div>
        )}

        {(useContractReadPoolAddress != ("0x0000000000000000000000000000000000000000" || undefined)) && useContractReadPoolBalance && (parseFloat(BigNumber.from(useContractReadPoolBalance).toString()) > 0.0) && (
          <div class="container py-5 px-10 mx-0 min-w-full flex flex-col items-center">
            <button
              type="button"
              disabled={!wPoolDeposit} onClick={() => wPoolDeposit?.()}
              className={`${Londrina.className} block rounded-md bg-white py-3 px-5 text-center text-2xl font-semibold text-nred shadow-sm hover:bg-nyellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
            >
              Create Bounty
            </button>
          </div>
        )}

        <div className="mt-8 flow-root">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className={`${Londrina.className} text-2xl text-nblue`}>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left font-semibold sm:pl-0">
                      Name
                    </th>
                    <th scope="col" className="py-3.5 px-3 text-left font-semibold">
                      Description
                    </th>
                    <th scope="col" className="py-3.5 px-3 text-left font-semibold">
                      Submissions
                    </th>
                    <th scope="col" className="py-3.5 px-3 text-left font-semibold">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bounties.map((bounty) => (
                    <tr key={bounty.title}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {bounty.title}
                      </td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{bounty.description}</td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{bounty.submissions}</td>
                      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{bounty.status}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {bounty.title}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>
    </div>
  )
}
