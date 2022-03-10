FROM python:3.9.10

RUN apt update -y
RUN apt install -y vim
RUN apt clean

RUN pip3 install py-solc-x==1.1.1
RUN pip3 install web3==5.28.0
RUN pip3 install python-dotenv==0.19.2
RUN pip3 install eth-brownie==1.18.1

RUN brownie networks add Development dev cmd=ganache-cli host=http://ganache-cli:8545

WORKDIR /blockchain
