pragma solidity >=0.4.21 <0.7.0;

contract File{
    mapping (bytes32 => filesInfo) internal hashInfo;

    struct  filesInfo{
        string file_name;
        string file_type;
        string file_secret;
    }

    modifier fileCheck(bytes32 _hashID){
         bytes memory tempData =  bytes(hashInfo[_hashID].file_name);
        require(tempData.length >0) ;
        _;

    }

    function getFileInfo(bytes32 _hashID) internal view returns(filesInfo memory filesinfo){

        return hashInfo[_hashID];

    }
}