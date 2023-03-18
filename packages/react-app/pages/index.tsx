import { useContract, useProvider, useContractWrite, usePrepareContractWrite } from 'wagmi'
import poolFactoryABI from "../../../utils/poolFactoryABI.json";
import { Londrina_Solid } from "@next/font/google";

const Londrina = Londrina_Solid({
  subsets: ["latin"],
  weight: "400"
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

  
  const { config } = usePrepareContractWrite({
    address: '0xC924C92e49996066363292dB5B31A79a4f658753',
    abi: poolFactoryABI,
    functionName: 'createPool',
    args: [""]
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <div>
      {/* <div className="h1">LFG!</div> */}
      <div>
      <button disabled={!write} onClick={() => write?.()}>
        Feed
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}

      <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          type="button"
          className={`${Londrina.className} block rounded-md bg-white py-2 px-3 text-center text-sm font-semibold text-nred shadow-sm hover:bg-nyellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
        >
          Create Pool
        </button>
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Bounties</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of the bounties for creators to bring value to the NOUNS community.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className={`${Londrina.className} block rounded-md bg-white py-2 px-3 text-center text-sm font-semibold text-nred shadow-sm hover:bg-nyellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
          >
            Create Bounty
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                  <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                    Submissions
                  </th>
                  <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
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
    </div>
  )
}
