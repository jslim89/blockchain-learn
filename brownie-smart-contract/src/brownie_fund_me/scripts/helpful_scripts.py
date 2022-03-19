from lib2to3.pgen2.token import STAR
from brownie import accounts, config, network, MockV3Aggregator
from web3 import Web3

DECIMALS = 8
STARTING_PRICE = 200000000000
LOCAL_BLOCKCHAIN_ENV = ['dev', 'ganache-local']

def get_account():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENV:
        return accounts[0]
    else:
        return accounts.add(config['wallets']['from_key'])
    

def deploy_mock():
    print(f'active network is {network.show_active()}')
    print('Deploying mock')
    if len(MockV3Aggregator) <= 0:
        MockV3Aggregator.deploy(
            DECIMALS, STARTING_PRICE, {"from": get_account()}
        )
    print(MockV3Aggregator[-1].address)
    print('mock deployed')