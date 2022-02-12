pragma solidity >=0.4.22 <0.9.0;

contract JsToken {

    string public name = 'JS Token';
    string public symbol = 'JST';
    string public standard = 'JS Token v1.0';
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    constructor (uint256 _initialSupply) {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[_to] += _value;
        balanceOf[msg.sender] -= _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}