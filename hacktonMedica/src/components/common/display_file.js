
import {  Button, Card } from 'antd';
import PopUp from "./popup";
import Icon from '@ant-design/icons';
import axios from "axios";

import React, { Component } from 'react'

export class display_file extends Component {
    state = {
        output :''
    }
      handlers=()=>{

        if (this.props.role=="patient"){
        axios.get("http://localhost:9090/ipfs_file?hash="+this.props.fhash+"&file_name="+this.props.filename+
        "&role=patient&token="+this.props.token+"&patient_address="+this.props.account)
        .then((response) => {
            console.log("from response"+response)
            if(response.data){
                console.log("from get info "+response.data)
                this.setState({output :response.data})

    } 
})
        }
        if(this.props.role=="doctor"){
      
            axios.get("http://localhost:9090/ipfs_file?hash="+this.props.fhash+"&file_name="+this.props.filename+
            "&role=doctor&address="+this.props.account+"&patient_address="+this.props.patient_address)
            .then((response) => {
                console.log("from response"+response)
                if(response.data){
                    console.log("from get info "+response.data)
                    this.setState({output :response.data})
    
        } 
    })

        }
}
    render() {
        return (
            <div>
            

<Card title={this.props.filename} bordered={true}>
    <h4>filehash: {this.props.fhash}</h4>
    <h4>filetype: {this.props.that.state.filesInfo[this.props.i]?this.props.that.state.filesInfo[this.props.i][1]:null}</h4>
    <Button type="primary" onClick={this.props.that.showFile.bind(this.props.that, this.props.fhash, true)}><Icon type="file" />Show File</Button>
    <PopUp showPopup={this.props.that.state.showPopup[this.props.i]} closePopup={this.props.that.showFile.bind(this.props.that, this.props.fhash, false)}>

    <Button type="primary" onClick={this.handlers.bind(this)}><Icon type="file" />load data</Button>
    {"     "+this.state.output}
    
    </PopUp>
</Card>
</div>
                
           
        )
    }
}
const flexStyle = {
    display:"flex", 
    flexDirection:"column"
}

export default display_file
