const JsToken = artifacts.require("./JsToken.sol");
const JsTokenSale = artifacts.require("./JsTokenSale.sol");

module.exports = function (deployer) {
  let tokenPrice = 1000000000000000;

  deployer.then(async () => {
    await deployer.deploy(JsToken, 1000000);
    await deployer.deploy(JsTokenSale, JsToken.address, tokenPrice);
  });
};
