pragma solidity >=0.4.22 <0.9.0;

import './JsToken.sol';

contract JsTokenSale {

    address admin;
    JsToken public tokenContract;
    uint256 public tokenPrice;

    constructor(JsToken _tokenContract, uint256 _tokenPrice) {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
}