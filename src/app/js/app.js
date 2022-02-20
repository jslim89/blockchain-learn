App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 750000,

    init: function() {
        console.log('App initialized...');
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            // if an web3 instance is already provided by meta mask
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContracts();
    },

    initContracts: function() {
        $.getJSON('JsTokenSale.json', function(jsTokenSale) {
            App.contracts.JsTokenSale = TruffleContract(jsTokenSale);
            App.contracts.JsTokenSale.setProvider(App.web3Provider);
            App.contracts.JsTokenSale.deployed().then(function(jsTokenSale) {
                console.log(jsTokenSale.address);
            });
        }).done(function() {
            $.getJSON('JsToken.json', function(jsToken) {
                App.contracts.JsToken = TruffleContract(jsToken);
                App.contracts.JsToken.setProvider(App.web3Provider);
                App.contracts.JsToken.deployed().then(function(jsToken) {
                    console.log(jsToken.address);
                });
            }).done(function() {
                App.listenForEvents();
                return App.render();
            });
        });
    },

    listenForEvents: function() {
        App.contracts.JsTokenSale.deployed().then(function(instance) {
            instance.Sell({
                fromBlock: 0,
                toBlock: 'latest',
            }, function(error, event) {
                console.log('event triggered', event);
                App.render();
            });
        });
    },

    render: function() {
        if (App.loading) {
            return;
        }
        App.loading = true;

        let loader = $('#loader');
        let content = $('#content');

        loader.show();
        content.hide();

        // load account data
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                $('#accountAddress').html('Your account: ' + account);
            }
        });

        // load token sale contract
        App.contracts.JsTokenSale.deployed().then(function(instance) {
            jsTokenSaleInstance = instance;
            return jsTokenSaleInstance.tokenPrice();
        }).then(function(tokenPrice) {
            App.tokenPrice = tokenPrice;
            $('.token-price').html(web3.utils.fromWei(App.tokenPrice), 'ether');
            return jsTokenSaleInstance.tokensSold();
        }).then(function(tokensSold) {
            App.tokensSold = tokensSold.toNumber();
            $('.tokens-sold').html(App.tokensSold);
            $('.tokens-available').html(App.tokensAvailable);

            let progressPercent = App.tokensSold / App.tokensAvailable * 100;
            $('.progress-bar').css('width', progressPercent, '%');

            // load token contract
            App.contracts.JsToken.deployed().then(function(instance) {
                jsTokenInstance = instance;
                return jsTokenInstance.balanceOf(App.account);
            }).then(function(balance) {
                $('.jst-balance').html(balance.toNumber());

                App.loading = false;
                loader.hide();
                content.show();
            });
        });
    },

    buyTokens: function() {
        $('#content').hide();
        $('#loader').show();

        let numOfTokens = $('#numberOfTokens').val();
        App.contracts.JsTokenSale.deployed().then(function(instance) {
            return instance.buyTokens(numOfTokens, {
                from: App.account,
                value: numOfTokens * App.tokenPrice,
                gas: 500000,
            });
        }).then(function(result) {
            console.log('token bought...');
            $('form').trigger('reset');
            // wait for Sell event
        });
    },
}

$(function() {
    $(window).on('load', function() {
        App.init();
    });
});