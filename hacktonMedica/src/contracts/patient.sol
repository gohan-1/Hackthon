pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;
contract Patient{
    mapping(address => patient) public patients;
    mapping(address=> mapping(address=>uint32)) public patientToDoctor;
     mapping(address=> mapping(string=> uint32)) patienToFile;
      mapping(address =>  address[]) public doctorList;
      mapping(address => string[]) public   files;

    uint32 public fileCount=1;
     uint32 public patientCount=1;


    struct patient{
           string name;
        uint8 age;
        address id;

        
       
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
            patients[msg.sender]=patient({name:_name,age:_age,id:msg.sender});

    }

        
    function patientInfo() public view patientExits(msg.sender) returns(string memory _name,uint  _age,string[] memory  _files,address[] memory  _list){
        patient storage d= patients[msg.sender];


    
        return(d.name,d.age,files[msg.sender],doctorList[msg.sender]);
    }

}