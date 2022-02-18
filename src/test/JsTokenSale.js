let JsToken = artifacts.require('./JsToken.sol');
let JsTokenSale = artifacts.require('./JsTokenSale.sol');

contract('JsTokenSale', function(accounts) {
    var tokenInstance;
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000; // in wei
    var numberOfTokens;
    let admin = accounts[0];
    let buyer = accounts[1];
    let tokensAvailable = 750000;

    it('initializes the contract with the correct values', function() {
        return JsTokenSale.deployed().then(function(instance) {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address) {
           assert.notEqual(address, 0x0, 'has contract address');
           return tokenSaleInstance.tokenContract();
        }).then(function(address) {
           assert.notEqual(address, 0x0, 'has token contract address');
           return tokenSaleInstance.tokenPrice();
        }).then(function(price) {
           assert.equal(price, tokenPrice, 'token price is correct');
        });
    });

    it('facilitates token buying', function() {
        return JsToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return JsTokenSale.deployed();
        }).then(function(instance) {
            tokenSaleInstance = instance;
            // provision 75% of all tokens to the token sale
            return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin });
        }).then(function(receipt) {
            numberOfTokens = 10;
            return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice });
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
            return tokenSaleInstance.tokensSold();
        }).then(function(amount) {
            assert.equal(numberOfTokens, amount.toNumber(), 'increments the number of tokens sold');
            return tokenInstance.balanceOf(buyer);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), numberOfTokens);
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
            return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 })
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
            return tokenSaleInstance.buyTokens(800000, { from: buyer, value: numberOfTokens * tokenPrice });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
        });
    });
});