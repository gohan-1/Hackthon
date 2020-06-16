pragma solidity >=0.4.21 <0.7.0;

contract Doctor{
    mapping (address =>mapping(address=>uint)) internal doctorToPainent;
    mapping (address=>doctor) internal doctors;

    struct doctor{
        string name;
        address id;
        address[] patientsList;
    }
    modifier doctorExist(address _id){
    doctor memory d= doctors[_id];
    require(d.id > address(0),"no id");
    _;

    }
    function doctorInfo() public view  returns(string memory _name,address[] memory list){
        doctor memory d= doctors[msg.sender];
        return(d.name,d.patientsList);
    }

    function doctorSignUp(string memory _name) public{
        require(keccak256(abi.encodePacked(""))!=keccak256(abi.encodePacked(_name)));
        doctor memory d= doctors[msg.sender];
            require(!(d.id > address(0)),"ID ALREADY EXIST");
            doctors[msg.sender]=doctor({name:_name,id:msg.sender,patientsList:new address[](0)});

    }
}