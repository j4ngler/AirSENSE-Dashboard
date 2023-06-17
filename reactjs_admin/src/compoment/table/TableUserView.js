
import React, { Component } from 'react';
import ManagerData from '../../actions/ManagerData.js'
import { DataGrid } from '@material-ui/data-grid';
import {
    Button,
    TextField
  } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import {exportColumeData } from '../../config/table/ManagerToView.js';
import DeleteDialogue from '../dialogue/DeleteDialogue.js';
import EditNomalDialogue from '../dialogue/EditNomalDialogue.js';
import AddNomalDialogue from '../dialogue/AddNomalDialogue.js';



import {ActionControl} from '../../utils/commonUtil';

class TableDataView extends Component {

    static propTypes = {
        selectChange: PropTypes.func.isRequired,
        table: PropTypes.string.isRequired,
    };
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            data:[],
            refesh:false,
            table:'users',
            value_fillter:"",
            dialogueEdit:false,
            dialogueDelete:false,
            dialogueAdd:false,
        }
    }
    componentDidMount(){
        const columns = exportColumeData(this.state.table,this.callBackEdit);
        this.setState({columns: columns });
        ManagerData.initdialogueCustomization(this.state.table);
        ManagerData.getLstDataPromise(this.state.table)
        .then((data)=>{
            data.map(item => {
                if(item.manafestid = 1) console.log(item);
            })
          this.setState({ data: ManagerData.getTable(this.state.table),
          });
        });
    }

    callBackEdit = (type) => {
        console.log(".............changeState",type);
        if(ActionControl.ACTION_ADD==type)  this.setState({ dialogueAdd:true});
        if(ActionControl.ACTION_UPDATE==type)  this.setState({ dialogueEdit:true});
        if(ActionControl.ACTION_DELETE==type)  this.setState({ dialogueDelete:true});
        
    }

    handleRowSelectBox = (e) => {
        console.log("handleRowSelectBox",e);
        ManagerData.dialogueCustomizationSave.lstSelect = e;
    }

    handleRowSelection = (e) => {
        console.log("handleRowSelection",e);
        ManagerData.dialogueCustomizationSave.dataInput = e.row;
        if(!!this.props.selectChange){
           return this.props.selectChange(e.row);
        } 
    }
    handleClose=()=>{ 
        this.setState({
            dialogueEdit:false,
            dialogueDelete:false,
            dialogueAdd:false
        });
        this.setState({ 
            data: ManagerData.getTable(this.state.table)
        });
    }
// rowHeight={125}
    render() {
        return (
            <div className="user-data">
                <div>
                        <TextField variant="outlined"  
                            value={this.state.value_fillter}  
                            onChange={(event) => {}} />
                        <Button 
                            variant="outlined" 
                            component="label" 
                            disableElevation
                            onClick={()=>{}} >
                            Lọc
                        </Button>
                        <Button 
                            variant="outlined" 
                            component="label" 
                            disableElevation
                            onClick={()=>{this.callBackEdit(ActionControl.ACTION_ADD)}} >
                            Thêm mới
                        </Button>
                </div>
                <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                        height={400}
                        rows={this.state.data} 
                        columns={this.state.columns}
                        className={"table-table"}
                        checkboxSelection={true}
                        onSelectionModelChange={(val) =>this.handleRowSelectBox(val)}
                        onRowClick={(val) =>this.handleRowSelection(val)}
                    />
                </div>
                {this.state.dialogueDelete?
                    <DeleteDialogue
                        table={this.state.table}
                        dataInput={ManagerData.dialogueCustomizationSave.dataInput}
                        handleClose={()=>{this.handleClose()}}
                    />
                    :
                    ""
                }
                {this.state.dialogueEdit?
                    <EditNomalDialogue
                        table={this.state.table}
                        dataInput={ManagerData.dialogueCustomizationSave.dataInput}
                        handleClose={()=>{this.handleClose()}}
                     />
                    :
                    ""
                }
                {this.state.dialogueAdd?
                    <AddNomalDialogue
                        table={this.state.table}
                        dataInput={ManagerData.dialogueCustomizationSave.dataInput}
                        handleClose={()=>{this.handleClose()}}
                     />
                    :
                    ""
                }

            </div>
        );
    }
}
//AddNomalDialogue
export default TableDataView;