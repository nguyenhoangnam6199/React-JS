import React, { Component } from 'react';
import TaskForm from './components/TaskForm';
import TaskControl from './components/TaskControl';
import TaskList from './components/TaskList';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],    //id:unique; name; status
      isDisplayForm: false,
      taskEditing: null,
      //Lọc
      filter: {
        name: '',
        status: -1
      },
      //Tìm Kiếm
      keyword: '',
      //Sắp xếp
      sortBy: 'name',
      sortValue: 1
    }
  }


  componentWillMount() {
    // console.log('aaaa');
    if (localStorage && localStorage.getItem('tasks')) {
      var tasks = JSON.parse(localStorage.getItem('tasks'));
      this.setState({
        tasks: tasks
      });
    }
  }


  s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }

  generateID() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-'
      + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
  }

  onToggleForm = () => { //Thêm task
    if (this.state.isDisplayForm && this.state.taskEditing !== null) {
      this.setState({
        isDisplayForm: true,
        taskEditing: null
      });
    }
    else {
      this.setState({
        isDisplayForm: !this.state.isDisplayForm,
        taskEditing: null
      });
    }
  }

  onCloseForm = () => {
    this.setState({
      isDisplayForm: false

    });
  }

  onShowForm = () => {
    this.setState({
      isDisplayForm: true
    });
  }

  onSubmit = (data) => {
    //console.log(data);
    var { tasks } = this.state;

    //Thêm sinh viên
    if (data.id === '') {
      data.id = this.generateID(); //la 1 cai task
      tasks.push(data);
    }
    //Sửa sinh viên
    else {
      var index = this.findIndex(data.id);
      tasks[index] = data;

    }

    this.setState({
      tasks: tasks,
      taskEditing: null
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));

  }

  findIndex = (id) => {
    var { tasks } = this.state;
    var result = -1;
    tasks.forEach((task, index) => {
      if (task.id === id) {
        // console.log(index);
        result = index;
      }
    });
    return result;
  }

  onUpdateStatus = (id) => {
    // console.log(id);
    var { tasks } = this.state;
    var index = this.findIndex(id);
    // console.log(index);
    if (index !== -1) {
      tasks[index].status = !tasks[index].status;
      this.setState({
        tasks: tasks
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

  }

  onDelete = (id) => {
    var { tasks } = this.state;
    var index = this.findIndex(id);
    // console.log(index);
    if (index !== -1) {
      //splice hoặc unshift là hàm xóa đi phần tử tại vị trí index bất kì trong javascript
      tasks.splice(index, 1);  //splice(vị trí, số lượng cần xóa)
      this.setState({
        tasks: tasks
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    this.onCloseForm();
  }

  onUpdate = (id) => {
    var { tasks } = this.state;
    var index = this.findIndex(id);
    var taskEditing = tasks[index];
    this.setState({
      taskEditing: taskEditing
    });
    this.onShowForm();
  }

  onFilter = (filterName, filterStatus) => {
    console.log(filterName, '-', filterStatus);
    filterStatus = parseInt(filterStatus, 10);
    this.setState({
      filter: {
        name: filterName.toLowerCase(),
        status: filterStatus
      }
    });
  }

  onSearch = (keyword) => {
    // console.log(keyword);
    this.setState({
      keyword: keyword.toLowerCase()
    });
  }


  onSort = (sortBy, sortValue) => {
    //console.log(sortBy, '-',sortValue);
    this.setState({
      sortBy: sortBy,
      sortValue: sortValue
    });

  }

  render() {
    var {
      tasks,
      isDisplayForm,
      taskEditing, filter,
      keyword,
      sortBy,
      sortValue
    } = this.state;
    // console.log(filter);
    if (filter) {
      if (filter.name) {
        tasks = tasks.filter((task) => {
          return task.name.toLowerCase().indexOf(filter.name) !== -1;
        })
      }
      tasks = tasks.filter((task) => {
        if (filter.status === -1) {
          return task;
        }
        else {
          return task.status === (filter.status === 1 ? true : false);
        }
      })
    }

    if (keyword) {
      tasks = tasks.filter((task) => {
        return task.name.toLowerCase().indexOf(keyword) !== -1;
      })
    }

    if(sortBy==='name'){
        tasks.sort((a,b)=>{
            if(a.name>b.name) return sortValue;
            else if(a.name<b.name) return -sortValue;
            else return 0;
        });
    }
    else{
      tasks.sort((a,b)=>{
        if(a.status>b.status) return -sortValue;
        else if(a.status<b.status) return +sortValue;
        else return 0;
    });
    }

    var elmTaskForm = isDisplayForm ?
      <TaskForm
        onCloseForm={this.onCloseForm}
        onSubmit={this.onSubmit}
        task={taskEditing}
      /> : '';
    return (
      <div className="container mt-15">
        <div className="text-center">
          <h1>Quản Lý Sinh Viên</h1><hr />
        </div>
        <div className="row">
          <div className={isDisplayForm === true ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : ''}>
            {elmTaskForm}
          </div>
          <div className={isDisplayForm === true ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.onToggleForm}
            >
              <span className="fa fa-plus mr-5"></span>
                  Thêm Sinh Viên
              </button>&nbsp;
            <br />
            <br />
            <TaskControl
              onSearch={this.onSearch}
              onSort={this.onSort}
              sortBy = {sortBy}
              sortValue={sortValue}
            />
            <br />
            <TaskList
              tasks={tasks}
              onUpdateStatus={this.onUpdateStatus}
              onDelete={this.onDelete}
              onUpdate={this.onUpdate}
              onFilter={this.onFilter}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;