import React, { Component } from 'react';

class TaskForm extends Component {

    constructor(props) {
        super(props);
        this.state ={
            id:'',
            name :'',
            status : false
        }
        
    }

    
    componentWillMount() {
        if(this.props.task){
            this.setState({
                id:this.props.task.id,
                name:this.props.task.name,
                status:this.props.task.status
            });
            console.log(this.state);
        }
    }

    //Khi Form mở thì componentWillMount sẽ ko chạy đc nên ta phải dùng ....ReceiveProps(nextProps)
    componentWillReceiveProps(nextProps){
        if(nextProps && nextProps.task){
            this.setState({
                id : nextProps.task.id,
                name : nextProps.task.name,
                status : nextProps.task.status
            });
            console.log(this.state);
        }
        else if(nextProps && nextProps.task===null){
            //Sửa thành thêm
            this.setState({
                id:'',
                name:'',
                status:false
            })
        }
    }
    

    onCloseForm =()=>{
        this.props.onCloseForm();
    }

    onChange=(event) =>{
        var target = event.target;
        var name = target.name;
        var value  = target.value;
        if(name==='status'){
            value = target.value==='true'?true:false;
        }
        this.setState({
            [name]:value,
        })
    }
    
    onSubmit  = (event)=>{
        event.preventDefault();
        // console.log(this.state);
        this.props.onSubmit(this.state);
        //Huy bo va Close Form
        this.onClear();
        this.onCloseForm();
    }

    onClear =()=>{
        this.setState({
            name:'',
            status : false
        })
    }
    render() {
        var {id} = this.state;
        return (
            <div className="panel panel-warning ">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        {id!==''?'Cập nhật Sinh Viên':'Thêm Sinh Viên'}
                        
                        <span
                            className="fa fa-times-circle text-right mr-le"
                            onClick={this.onCloseForm}
                        ></span>
                    </h3>
                </div>
                <div className="panel-body">
                    {/* Thiết lập nút lưu */}
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Tên :</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={this.state.name}
                                onChange = {this.onChange}
                            />
                        </div>
                        <label>Trạng Thái :</label>
                        <select
                            className="form-control"
                            name="status"
                            value={this.state.status}
                            onChange = {this.onChange}
                        >
                            <option value={true}>Đang Học</option>
                            <option value={false}>Nghỉ Học</option>
                        </select><br />
                        <div className="text-center">
                            <button type="submit" className="btn btn-warning">
                                <i className="fa fa-plus mr-5"></i>Lưu Lại
                    </button>&nbsp;
                    <button type="button" 
                    onClick={this.onClear} 
                    className="btn btn-danger"
                    >
                                <span className="fa fa-close mr-5"></span>Hủy Bỏ
                    </button>
                        </div>
                    </form>
                </div>
            </div>

        );
    }
}

export default TaskForm;