const Migrations = artifacts.require("HealthCare");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
