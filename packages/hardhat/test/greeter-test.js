const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OENouns", function () {
  it("Should return the new greeting once it's changed", async function () {
    const OENouns = await ethers.getContractFactory("OENouns");
    const oENouns = await OENouns.deploy();
    await oENouns.deployed();
  });
});
