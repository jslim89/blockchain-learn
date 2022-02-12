const JsToken = artifacts.require("./JsToken.sol");

module.exports = function (deployer) {
  deployer.deploy(JsToken, 1000000);
};
