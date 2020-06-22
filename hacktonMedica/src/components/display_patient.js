import React, { Component } from 'react';
import { getPatientInfoForDoctor } from '../utils/eth-util';
import { getFileInfo } from "../utils/eth-util";
import {   Card } from 'antd';
import { connect } from "react-redux";
import PopUp from "./common/popup";
import DisplayFiles from "./common/display_file";
import Icon from '@ant-design/icons';

class DisplayPatient extends Component {

    constructor(props){
        super(props);
    }

    state = {
        patient_name:"",
        patient_age:0,
        patient_files:[],
        filesInfo:[],
        account:'',
        showPopup:[],
    }

   async componentWillMount() {
     
        //console.log("doctet"+this.state.doctorId)
        if(this.props.patient_address)
            getPatientInfoForDoctor(this.props.patient_address, (data) => {
                this.setState({patient_name:data[0],patient_age:parseInt(data[1]) ,patient_files:data[3]},
                () => {
                    let  { patient_files } = this.state;
                    getFileInfo("doctor", patient_files, this.props.patient_address, (filesInfo) => {
                        this.setState({filesInfo});
                    });
                });
            });
    }

    showFile(hash, flag) {
        let { patient_files, showPopup } = this.state;
        if(patient_files.indexOf(hash) > -1){
            let showPopupTemp = showPopup.slice(0);
            showPopupTemp[patient_files.indexOf(hash)] = flag;
            this.setState({showPopup:showPopupTemp});
        }
    }

    render() {
        let { patient_address } = this.props;
        let { patient_name, patient_age, patient_files } = this.state;
        let { token } = this.props.auth;

        let files,filename

        return(
            <div style={{width:"100%"}}>
                <Card bordered={true} style={flexStyle}>
                    <h4>patient address: {patient_address}</h4>
                    <h4> patien name: {patient_name}</h4>
                    <h4>patient age: {patient_age}</h4>
                 
                </Card>
                <div style={{height: "500px", overflowY: "scroll"}}>
                    <Icon type="folder" /> 
                
                     {Object.keys(patient_files).map((key,i) => <div>
                  
                      
                         <DisplayFiles that={this} fhash={patient_files[key]} i={i} filename = {this.state.filesInfo[i]?this.state.filesInfo[i][0]:null} diplayImage = {"http://localhost:9090/ipfs_file?hash="+patient_files[key]+"&file_name="+filename+
                                    "&role=doctor&address="+this.state.account+"&patient_address="+this.props.patient_address} patient_address={patient_address} files={patient_files}  account={this.state.account}  role="doctor"/>
                
                
                </div>)}

                </div>
            </div>
        );
    }
}

const flexStyle = {
    display:"flex", 
    flexDirection:"column"
}

//export default DisplayPatient;
const mapStateToProps = (state) => {
    return {
      global_vars: state.global_vars,
      auth: state.auth
    };
};

//export default Home;
export default connect(mapStateToProps, {})(DisplayPatient);