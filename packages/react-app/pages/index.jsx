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
import ERC721OENouns from "../utils/ERC721OENouns.json";
const { BigNumber } = require('ethers');

const Londrina = Londrina_Solid({
  subsets: ["latin"],
  weight: "300"
});

export default function Home() {

  const bounties = [
    // {
    //   title: 'Create AR Noun Filter',
    //   description: 'Create an AR noogles filter.',
    //   submissions: '3',
    //   status: 'Open'
    // },
    // More bounties...
  ]

  let { address, isConnected } = useAccount();
  let [nftAddress, setNftAddress] = useState("0x0384890232B335454E4fce99F379c08329213F4e");
  let [pooledNftAddress, setPooledNftAddress] = useState("0xC924C92e49996066363292dB5B31A79a4f658753");
  let [approveNftTokenId, setApproveNftTokenId] = useState(0);
  let [depositNftTokenId, setDepositNftTokenId] = useState(0);
  let [bTitle, setBTitle] = useState("");
  let [bDescription, setBDescription] = useState("");
  let [bDeadline, setBDeadline] = useState("");

  // Get pool address from a specific collection
  // If none, then we need to create one to deposit any ERC721
  const { data: useContractReadPoolAddress, isError: isErrorPoolAddress, isLoading: isLoadingPoolAddress } = useContractRead({
    address: pooledNftAddress,
    abi: ERC721PoolFactoryABI,
    functionName: 'getPool',
    args: [nftAddress]
  });

  // Get pool ERC20 balance for connected wallet
  const { data: useContractReadPoolBalance, isError: isErrorPoolBalance, isLoading: isLoadingPoolBalance } = useContractRead({
    address: useContractReadPoolAddress,
    abi: ERC721PoolABI,
    functionName: 'balanceOf',
    args: [nftAddress]
  });

  // Prepare write to create pool
  const { config: configPoolCreate } = usePrepareContractWrite({
    address: pooledNftAddress,
    abi: ERC721PoolFactoryABI,
    functionName: 'createPool',
    args: [nftAddress],
    enabled: false
  });

  // Prepare write to grant pool to transfer nfts
  const { config: configPoolApprove } = usePrepareContractWrite({
    address: nftAddress,
    abi: ERC721OENouns,
    functionName: 'approve',
    args: [useContractReadPoolAddress, [approveNftTokenId]],
    enabled: true
  });

  // Prepare write to deposit nft in pool
  const { config: configPoolDeposit } = usePrepareContractWrite({
    address: useContractReadPoolAddress,
    abi: ERC721PoolABI,
    functionName: 'deposit',
    args: [[depositNftTokenId]],
    enabled: true
  });

  // POOL CREATION
  const {data : dPoolCreate, isLoading: iLPoolCreate, isSuccess: iSPoolCreate, write: wPoolCreate } = useContractWrite(configPoolCreate);
  const {data : useWaitForPoolCreate, isSuccess: poolCreateSuccess} = useWaitForTransaction({
    hash: dPoolCreate?.hash
  });

  // POOL APPROVE
  const {data : dPoolApprove , isLoading: iLPoolApprove, isSuccess: iSPoolApprove, write: wPoolApprove } = useContractWrite(configPoolApprove);
  const {data : useWaitForPoolApprove, isSuccess: poolApproveSuccess} = useWaitForTransaction({
    hash: dPoolApprove?.hash
  });

  // POOL DEPOSIT
  const {data : dPoolDeposit , write: wPoolDeposit } = useContractWrite(configPoolDeposit);
  const {data : useWaitForPoolDeposit, isSuccess: poolDepositSuccess} = useWaitForTransaction({
    hash: dPoolDeposit?.hash
  });

  const createBountyIpfs = async () => {
    const {ipfsHash} = await fetch('/api/ipfs', {
      method: 'POST',
      body: JSON.stringify({
        title: bTitle,
        description: bDescription,
        deadline: bDeadline
      })
    }).then(response => response.json());
    // returning ipfs hash for it to be added
    // to custom escrow smart contract
    return ipfsHash;
  }

  useEffect(() => {
    console.log("__________________________");
    console.log("pool address");
    console.log("useContractReadData", useContractReadPoolAddress);
    console.log("pool balance for current wallet");
    console.log("useContractReadData", parseFloat(BigNumber.from(useContractReadPoolBalance).toString()) );
    console.log("__________________________");
    console.log("Pool Create");
    console.log("useContractWriteData:", dPoolCreate);
    console.log("useWaitForTransactionData:", useWaitForPoolCreate);
    console.log("__________________________");
}, [useContractReadPoolAddress, useContractReadPoolBalance, dPoolCreate, useWaitForPoolCreate, dPoolDeposit, useWaitForPoolDeposit]);

  return (
    <div>
      
      <div>
        {/* If address is either zero or undefined then wallet can create a pool for the specific nft collection  */}
        {/* {(!isErrorPoolAddress && !isLoadingPoolAddress && !iLPoolCreate && !iSPoolCreate && useContractReadPoolAddress == ("0x0000000000000000000000000000000000000000" || undefined)) && ( */}
          <div className="container py-5 px-10 mx-0 min-w-full flex flex-col items-center">
            <button
              type="button"
              // disabled={!wPoolCreate}
              onClick={() => wPoolCreate?.()}
              className={`${Londrina.className} block rounded-md bg-white py-3 px-5 text-center text-2xl font-semibold text-nred shadow-sm hover:bg-nyellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
            >
              Create Pool
            </button>
          </div>
        {/* )} */}

        {/* {(!isErrorPoolBalance && !isLoadingPoolBalance && useContractReadPoolAddress != ("0x0000000000000000000000000000000000000000" || undefined)) && useContractReadPoolBalance && (parseFloat(BigNumber.from(useContractReadPoolBalance).toString()) == 0.0) && ( */}
          <div className="container py-5 px-10 mx-0 min-w-full flex flex-col items-center">
            <div className="m-3">
              <input
                id="approveNftTokenId"
                name="approveNftTokenId"
                type="text"
                required
                value={approveNftTokenId}
                onChange={(e) => { setApproveNftTokenId(e.target.value)}}
                disabled={false}
                className="block w-full appearance-none border border-nyellow px-3 py-2 text-nblue focus:border-forest focus:outline-none focus:ring-forest sm:text-sm"
              />
            </div>
            <button
              type="button"
              // disabled={!wPoolApprove}
              onClick={() => wPoolApprove?.()}
              className={`${Londrina.className} block rounded-md bg-white py-3 px-5 text-center text-2xl font-semibold text-nred shadow-sm hover:bg-nyellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
            >
              Approve NFT
            </button>
          </div>
        {/* )} */}

        {/* {(!isErrorPoolBalance && !isLoadingPoolBalance && useContractReadPoolAddress != ("0x0000000000000000000000000000000000000000" || undefined)) && useContractReadPoolBalance && (parseFloat(BigNumber.from(useContractReadPoolBalance).toString()) == 0.0) && ( */}
          <div className="container py-5 px-10 mx-0 min-w-full flex flex-col items-center">
          <div className="m-3">
              <input
                id="depositNftTokenId"
                name="depositNftTokenId"
                type="text"
                required
                value={depositNftTokenId}
                onChange={(e) => { setDepositNftTokenId(e.target.value)}}
                disabled={false}
                className="block w-full appearance-none border border-nyellow px-3 py-2 text-nblue focus:border-forest focus:outline-none focus:ring-forest sm:text-sm"
              />
            </div>
            <button
              type="button"
              // disabled={!wPoolDeposit}
              onClick={() => wPoolDeposit?.()}
              className={`${Londrina.className} block rounded-md bg-white py-3 px-5 text-center text-2xl font-semibold text-nred shadow-sm hover:bg-nyellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
            >
              Deposit NFT
            </button>
          </div>
        {/* )} */}

        <div className="bg-white py-8 px-4 border border-onyx sm:px-10">
          <form className="space-y-6" onSubmit={event => {
            event.preventDefault();
            sendToNumber(gitHubUsername, amountToSend);
          }}>

            <div>
              <label htmlFor="identifierType" className="block text-sm font-medium text-onyx">
                Title
              </label>
              <div className="mt-1">
                <input
                  id="identifierType"
                  name="identifierType"
                  type="text"
                  autoComplete="identifierType"
                  required
                  value={bTitle}
                  onChange={(e) => { setBTitle(e.target.value)}}
                  className="block w-full appearance-none border border-onyx px-3 py-2 bg-gypsum text-wood focus:border-forest focus:outline-none focus:ring-forest sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-onyx">
                Description
              </label>
              <div className="mt-1">
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="identifier"
                  required
                  value={bDescription}
                  onChange={(e) => { setBDescription(e.target.value)}}
                  className="block w-full appearance-none border border-onyx px-3 py-2 bg-gypsum text-wood focus:border-forest focus:outline-none focus:ring-forest sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-onyx">
                Deadline
              </label>
              <div className="mt-1">
                <input
                  id="bDeadline"
                  name="bDeadline"
                  type="text"
                  required
                  value={bDeadline}
                  onChange={(e) => { setBDeadline(e.target.value)}}
                  className="block w-full appearance-none border border-onyx px-3 py-2 bg-gypsum text-wood focus:border-forest focus:outline-none focus:ring-forest sm:text-sm"
                />
              </div>
            </div>

          </form>                        
        </div>

        {/* {(useContractReadPoolAddress != ("0x0000000000000000000000000000000000000000" || undefined)) && useContractReadPoolBalance && (parseFloat(BigNumber.from(useContractReadPoolBalance).toString()) > 0.0) && ( */}
        <div className="container py-5 px-10 mx-0 min-w-full flex flex-col items-center">
            <button
              type="button"
              disabled={!wPoolDeposit} onClick={() => wPoolDeposit?.()}
              className={`${Londrina.className} block rounded-md bg-white py-3 px-5 text-center text-2xl font-semibold text-nred shadow-sm hover:bg-nyellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
            >
              Create Bounty
            </button>
          </div>
        {/* )} */}

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
