from brownie import FundMe, MockV3Aggregator, config, network
from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENV, deploy_mock, get_account


def deploy_fund_me():
    account = get_account()

    # if we are on a persistent network like rinkeby, use associated address
    # otherwise, deploy mocks
    price_feed_addr = price_feed_address()
    print(f"price feed addr: {price_feed_addr}")
    fund_me = FundMe.deploy(
        price_feed_addr,
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"],
    )
    print(f"Contract deploy to {fund_me.address}")


def price_feed_address():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENV:
        return config["networks"][network.show_active()]["eth_usd_price_feed"]
    else:
        deploy_mock()
        return MockV3Aggregator[-1].address


def main():
    print("test")
    deploy_fund_me()
