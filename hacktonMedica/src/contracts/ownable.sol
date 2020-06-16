pragma solidity >=0.4.21 <0.7.0;

contract Ownable{
    address owner;

    event ownerShipRenounced(address indexed previousOwner) ;
    event ownershipTransfers(address indexed  previousOwner,address indexed newOwner);

    constructor() public{
        owner = msg.sender;
    }
    modifier onlyowner(){
        require(msg.sender== owner);
        _;
    }

    function ownershipRenounced() public{
        owner=address(0);
       

    }

    function ownershipTransfer(address  _newowner) public onlyowner{
        _transferOwnership( _newowner);
        emit ownershipTransfers(msg.sender,_newowner);
    }

    function _transferOwnership(address _newowner) internal{
           require(_newowner != address(0));
    emit ownershipTransfers(owner, _newowner);
        owner=_newowner;

    }

}