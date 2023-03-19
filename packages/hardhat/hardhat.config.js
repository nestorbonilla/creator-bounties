require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config({ path: ".env" });
require("hardhat-deploy");
const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-ethers");
require("@typechain/hardhat");
require("@nomiclabs/hardhat-etherscan");

// This is the mnemonic
const DEVCHAIN_MNEMONIC = process.env.MNEMONIC;
const alchemyKey = process.env.ALCHEMY_API_KEY;
const privateKey = process.env.PRIVATE_KEY;
const etherscanKey = process.env.ETHERSCAN_API_KEY;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    defaultNetwork: "goerli",
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
            accounts: {
                mnemonic: DEVCHAIN_MNEMONIC,
            },
        },
        goerli: {
            url: "https://eth-goerli.g.alchemy.com/v2/" + alchemyKey,
            accounts: [privateKey],
            chainID: 5,
        },
    },
    etherscan: {
        apiKey: etherscanKey
    },
    solidity: {
        version: "0.8.17",
    },
    namedAccounts: {
        deployer: 0,
    },
    typechain: {
        outDir: "types",
        target: "web3-v1",
        alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
        externalArtifacts: ["externalArtifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
    },
};

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

task(
    "devchain-keys",
    "Prints the private keys associated with the devchain",
    async (taskArgs, hre) => {
        const accounts = await hre.ethers.getSigners();
        const hdNode = hre.ethers.utils.HDNode.fromMnemonic(DEVCHAIN_MNEMONIC);
        for (let i = 0; i < accounts.length; i++) {
            const account = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);
            console.log(
                `Account ${i}\nAddress: ${account.address}\nKey: ${account.privateKey}`
            );
        }
    }
);

task("create-account", "Prints a new private key", async (taskArgs, hre) => {
    const wallet = new hre.ethers.Wallet.createRandom();
    console.log(`PRIVATE_KEY="` + wallet.privateKey + `"`);
    console.log();
    console.log(`Your account address: `, wallet.address);
});

task("print-account", "Prints the address of the account", () => {
    const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY);
    console.log(`Account: `, wallet.address);
});
