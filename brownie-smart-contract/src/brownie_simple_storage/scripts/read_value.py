from brownie import SimpleStorage, accounts, config


def read_contract():
    # -1 will always get the latest deployed contract address
    simple_storage = SimpleStorage[-1]
    print(simple_storage.retrieve())


def main():
    read_contract()