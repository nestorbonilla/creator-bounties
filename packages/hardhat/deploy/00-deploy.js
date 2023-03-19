// deploy/00_deploy_my_contract.js

// const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("OENouns", {
    from: deployer,
    args: [],
    log: true,
  });
};

module.exports.tags = ["OENouns"];
