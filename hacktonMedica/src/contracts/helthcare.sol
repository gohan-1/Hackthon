pragma solidity >=0.4.21 <0.7.0;
 

 import "./doctor.sol";
import "./patient.sol";
import "./file.sol";
import "./ownable.sol";

contract HealthCare is File,Doctor,Patient{
    address public owner;
   
    

    constructor() public {
        owner= msg.sender;
    }
     modifier onlyowner(){
        require(msg.sender== owner);
        _;
    }

    modifier CheckfileAccess(string memory role,address id,bytes32 fileHashId,address pat){
        // uint256  pos ;
        
        if(keccak256(abi.encodePacked("role"))!=keccak256(abi.encodePacked("doctor"))){
         require(patientToDoctor[pat][id] > 0);
            //  pos = patienToFile[pat][fileHashId];
            // require(pos > 0);
        }
        // if(keccak256(abi.encodePacked("role"))!=keccak256(abi.encodePacked("patient"))){
        //        bytes32 pos = patienToFile[id];
        //         require(pos); 
        // }
        _;
    }

function checkProfile(address _user) public view returns(string memory, string memory){
      patient memory p = patients[_user];
      doctor memory d = doctors[_user];
      
      if(p.id == _user)
          return (p.name, 'patient');
      else if(d.id == _user)
          return (d.name, 'doctor');
      else
          return ('default', 'default');
  }
  
    

    function addFile(string memory _file_name,string memory _file_type,bytes32  fileHashId,string memory _file_secret) public {
      
         patient memory p = patients[msg.sender];
        // require (patienToFile[msg.sender][fileHashId]<1);//checking already exist 

        hashInfo[fileHashId]=filesInfo({file_name:_file_name,file_type:_file_type,file_secret:_file_secret});
        
        p.files=fileHashId;
       
        // patienToFile[msg.sender][fileHashId]=fileCount;
        fileCount=fileCount+1;

    }

    function grantAcessToDoctor(address  _docterId) public patientExits(msg.sender) doctorExist(_docterId){
        patient storage p = patients[msg.sender];
        doctor memory d = doctors[_docterId];

        // require(patientToDoctor[msg.sender][_docterId]<1);//already hav permission
    
        // uint pos= p.doctorList.push(_docterId);
        p.doctorList[patientCount]=_docterId;
        patientToDoctor[msg.sender][_docterId]=patientCount;
        d.patientsList[patientCount]=msg.sender;
        patientCount=patientCount+1;
    }

    function getPatientInfoForDocter(address  _pat) public view patientExits(_pat) doctorExist(msg.sender) returns(string memory _name,uint age,address id,bytes32  files ){
      patient memory p = patients[_pat]; 
      require(doctorToPainent[msg.sender][_pat]>1);
      return  (p.name,p.age,p.id,p.files);
    }



    function getFileInfoDoctor(address    doc, address   pat, bytes32  fileHashId) public view 
    onlyowner  patientExits(pat) doctorExist(doc)  CheckfileAccess("doctor",doc,fileHashId,pat)returns (string memory name, string memory types){
        filesInfo memory f= getFileInfo(fileHashId);
        return(f.file_name,f.file_type);
    }


     function getFileInfoPatient(address    pat,  bytes32   fileHashId) public view returns (string memory name, string memory types){
            filesInfo memory f= getFileInfo(fileHashId);
        return(f.file_name,f.file_type);
     }

     function getFileSecret(bytes32  fileHashId,string memory role,address  id,address   pat) public view  fileCheck(fileHashId) CheckfileAccess(role,id,fileHashId,pat) returns (string memory secret) {
                 filesInfo memory f= getFileInfo(fileHashId);
                 return(f.file_secret);


     }


}