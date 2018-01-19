var BayernToken = artifacts.require("BayernToken");

module.exports = function(deployer) {
  deployer.deploy(BayernToken, 100000);
};
