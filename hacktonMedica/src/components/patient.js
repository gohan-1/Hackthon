import React, { Component } from 'react';
import {  Button, Input, Upload, message, Row, Col, Tag, Card, Collapse } from 'antd';
import { connect } from "react-redux";
import { updateFileHash, getFileInfo } from "../utils/eth-util";
import DisplayFiles from "./common/display_file";
import Icon from '@ant-design/icons';



const Panel = Collapse.Panel;
const Dragger = Upload.Dragger;

class Patient extends Component {

    constructor(props){
        super(props);
        this.array=[]
        //this.onChange = this.onChange.bind(this);
    }

    state = {
        name: "",
        age: 0,
        files: [],
        doctor_list: [],
        filesInfo:[],
        showPopup:[],
        doctorId: null,
        secret: null,
        visible: false,
        account:'',
        arr:[]
    }

    componentDidMount(){
        let { healthRecord } = this.props.global_vars;
        
        if(healthRecord)
            this.loadPatient(healthRecord);
        
        this.fileProps.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps){
        let { healthRecord } = this.props.global_vars;
        if(healthRecord !== nextProps.global_vars.healthRecord) {
            this.loadPatient(nextProps.global_vars.healthRecord);   
        }
    }

    async loadPatient(healthRecord){
        let {  web3 } = this.props.global_vars;
        let accounts= await web3.eth.getAccounts()
        //console.log("account"+accounts[0])
        this.setState({account:accounts[0]})
        //console.log("file1 working")
        let res = await healthRecord.methods.patientInfo().call({from:accounts[0]})
        //console.log("file1"+typeof(res[4]))
        console.log("from patient"+res[3])
        if(res[3]){
            console.log("docter list"+res[3])
        this.setState({name:res[0],age:parseInt(res[1]),files:res[2],doctor_list:res[3]},
        () => {
            console.log("first click")
            let  { files } = this.state;
            getFileInfo("patient", files, "", (filesInfo) => {
                                console.log("filesInfo"+filesInfo);

                this.setState({filesInfo});
                //console.log("filesInfo"+filesInfo);
            }); 
            
        });
    }
    else{
        this.setState({name:res[0],age:parseInt(res[1]),files: this.state.files.concat(res[2])},
        () => {
            console.log("second click")
            let  { files } = this.state;
            console.log(this.state.files)
            getFileInfo("patient", files, "", (filesInfo) => {
                // console.log("file info"+filesInfo[0][0])
                this.setState({filesInfo});
                console.log("file"+typeof(files))
                console.log("adad"+typeof(Object.values(files)))
                //console.log("filesInfo"+filesInfo);
            }); 
            
        });

    }
    
    }

    async grantAccess(){
        let { healthRecord, web3 } = this.props.global_vars;
        let accounts= await web3.eth.getAccounts()
        //console.log("doctet"+this.state.doctorId)
        
        if(this.state.doctorId){
            //console.log("doctet"+this.state.doctorId)
            //console.log(typeof(this.state.doctorId))
            //console.log(accounts[0])
            //console.log(typeof(accounts[0]))
            let res = await healthRecord.methods.grantAcessToDoctor(this.state.doctorId).send({from:accounts[0]})
           
            
            if(res) {
                console.log("res of docter"+res.data)
                message.success('access successful');
                this.setState({doctorId:null});
            }
        }
    }

    onTextChange(type, e){
        if(e && e.target)
            this.setState({[type]:e.target.value});
    }

    fileProps = {
        name: 'file',
        multiple: true,
        action: "http://localhost:9090/ipfs_upload",
        beforeUpload: (file, fileList) => {
            //console.log("before")
            if(file.size > 5242880)// less than 5 MB
                return false
        },
        headers: {secret: this.state.secret},
        onChange: (info) => {
            //console.log("info started")
            //QmQpeUrxtQE5N2SVog1ZCxd7c7RN4fBNQu5aLwkk5RY9ER
            const status = info.file.status;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                if(info.file.response){
                    let { name, type, response } = info.file;

                    if(response) {
                        message.success('file uploaded successfully to ipfs');
                        //console.log('secret '+response);
                        updateFileHash(name, type, response, this.state.secret);
                    }
                    else
                        message.error("file upload unsuccessful");
                }
                //console.log(this.state.files)
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        }
    };

    // togglePopUp(flag) {
    //     this.setState({visible: flag});
    // }

    showFile(hash, flag) {
        let { files, showPopup } = this.state;
        console.log("froshow "+hash)
        if(files.indexOf(hash) > -1){
            console.log("froshow inside"+hash)

            let showPopupTemp = showPopup.slice(0);
            showPopupTemp[files.indexOf(hash)] = flag;
            this.setState({showPopup:showPopupTemp});
        }
    }

    render() {
        let { name, age, files, doctor_list,filesInfo, account} = this.state;
    
        let { web3 } = this.props.global_vars;
        let { token } = this.props.auth;

        let fhash,filename
      
        


        this.fileProps.headers.secret = this.state.secret
        this.fileProps.onChange.bind(this);

        return (
            <div>
           
                <Row gutter={16} style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <Col className='col-3' span={6}>
                        <Card bordered={true} >
                            <div className='userDetails'  style={flexStyle}>
									<span>Name: {name}</span>
									<span>Age: {age}</span>
								
                            </div>
                        </Card>
                    </Col>
                    <Col className='col-3' span={6}>
                        <Card bordered={true}>
                            <div style={flexStyle}>
                                <Input className='emailId' style={{width:"100%"}} value={this.state.doctorId} onChange={this.onTextChange.bind(this, 'doctorId')} size="small" placeholder="Doctor Address"/>
                                <Button type="primary" onClick={this.grantAccess.bind(this)} htmlType="submit" className="login-form-button loginButton">
                                    Grant Access
                                </Button>
                            </div>
                        </Card>
                    </Col>
                    <Col className='col-3' span={6}>
                        <Card bordered={true}>
                            <Input className='emailId' style={{width:"100%"}} value={this.state.secret} onChange={this.onTextChange.bind(this, 'secret')} size="small" placeholder="One Time Secret"/>
                            <Dragger {...this.fileProps} disabled={this.state.secret?false:true}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            </Dragger>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Collapse className='folderTab' defaultActiveKey={['1']}>
                        <Panel   header={<Icon type="folder" />} key="1">
                        {Object.keys(files).map((key,i) => <div>{files[key]}
                         
                         

                         <DisplayFiles that={this} fhash={files[key]} i={i} filename = {this.state.filesInfo[i]?this.state.filesInfo[i][0]:null} diplayImage = {"http://localhost:9090/ipfs_file?hash="+files[key]+"&file_name="+filename+
                                    "&role=patient&token="+token+"&patient_address="+account}  files={files} token={token} account={account} filesInfo={filesInfo} role="patient"/>
                
                
                </div>)}

                        </Panel>
                        <Panel header="Doctors List" key="2">
                            { 
                                doctor_list.map((doctor) => {
                                    return <Tag>{doctor}</Tag>
                                }) 
                            }
                        </Panel>
                    </Collapse>
                </Row>
            </div>
        );
    }
}

const flexStyle = {
    display:"flex", 
    flexDirection:"column"
}

const mapStateToProps = (state) => {
    return {
      auth: state.auth,
      global_vars: state.global_vars,
    };
};

//export default Home;
export default connect(mapStateToProps, {})(Patient);