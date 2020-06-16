pragma solidity >=0.4.21 <0.7.0;

contract Patient{
    mapping(address => patient) public patients;
    mapping(address=> mapping(address=>uint)) public patientToDoctor;
     mapping(address=> bytes32) public patienToFile;
    uint256 public fileCount=0;
     uint256 public patientCount=0;


    struct patient{
           string name;
        uint8 age;
        address id;
        bytes32 files;
        
        
        mapping(uint => address) doctorList;
    }
    modifier patientExits(address  _id){
         
    patient memory d= patients[_id];
    require(d.id > address(0),"no id");
    _;
    }

    function patientSignUp(string memory _name,uint8  _age) public{
        require(keccak256(abi.encodePacked(""))!=keccak256(abi.encodePacked(_name)));
        patient memory p= patients[msg.sender];
            require(!(p.id > address(0)),"ID ALREADY EXIST");
            patients[msg.sender]=patient({name:_name,age:_age,id:msg.sender,files:''});

    }

        
    function patientInfo() public view patientExits(msg.sender) returns(string memory _name,uint  _age,bytes32  _files,address[] memory  _list){
        patient storage d= patients[msg.sender];

        if(patientCount>0){

         address[] memory ret = new address[](patientCount);
         for (uint i = 0; i <= patientCount; i++) {
        ret[i] = d.doctorList[patientCount];
        }

        return(d.name,d.age,d.files,ret);
        }
        else{
            return(d.name,d.age,d.files,new address[](0));
        }
    }

}