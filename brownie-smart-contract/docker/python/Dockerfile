FROM jslim/python-brownie:latest

RUN pip3 install pytest==7.1.1

# to persist the contract in local ganache
RUN brownie networks add Ethereum ganache-local host=http://ganache-cli:8545 chainid=1337

# for test purpose, contract will not be actually deployed
RUN brownie networks add Development dev cmd=ganache-cli host=http://ganache-cli:8545

WORKDIR /blockchain
