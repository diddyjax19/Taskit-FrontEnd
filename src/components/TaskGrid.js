import React,{useState,useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { isAuthenticated, isLead, isStaff } from '../auth/helper';
import { axiosInstance } from '../axiosInstance';
import { getPaginatedSubTasks } from './helper.js';


const TaskGrid = ({name,
    description,
    start_date,
    end_date,
    handleInputChange,
    editTask,
    deleteTask,
    edit,
    createNewTask,
    setAssignedTo,
    user_assigned,
    state,
    ChangeUserAssigned,
    match
}) => {
    const [users, setUsers] = useState([])
    const [email, setEmail] = useState('');
    const [children,setChildren] = useState([])
    const [next, setNext] = useState();
    const [prev, setPrev] = useState();
    
    
    useEffect(()=>{
        if (user_assigned) {
            setEmail(user_assigned);
            ChangeUserAssigned()
        }
    });

    const getNewSubTasks = (url) => {
        getPaginatedSubTasks(url)
            .then(resp => {
                setNext(resp.data?.next)
                setPrev(resp.data?.previous)
                setChildren(children.concat(resp.data?.results))
                console.log(children);
            })
            .catch(err => {
                console.log(err);
            })  
    }

    useEffect(() => {
        if (!createNewTask) {
            getNewSubTasks(`task/sub-task/${match.params?.task_id}/`)
        }
        
    },[]);

    const showUsersInDropdown = (email) => {
        axiosInstance.get(`user/search/${email}`,{
            headers: {
                Authorization: `Token ${isAuthenticated()}`
            }
        })
            .then(resp => {
                setUsers(resp.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const onEmailChange = e => {
        setEmail(e.target.value);
        showUsersInDropdown(e.target.value)
    }



    return (
        <div className="container py-5">
            <form onSubmit={e => e.preventDefault()}>
                <div className="">
                    <ul className="nav justify-content-center">
                        
                        {
                            isLead() && (
                                <li className="nav-item">
                                    <Link to={`/project/${match.params?.id}/task/${match.params?.task_id}/subtask/`} className="nav-link">Create Sub Task</Link>
                                </li>
                            )
                        }
                    </ul>
                </div>
                
                <div className="ml-auto " style={{textAlign: "right"}}>
                    {
                        
                        isStaff()&& editTask && (<button disabled={!edit} 
                        onClick={editTask}
                        className="btn btn-success m-1">Save</button>)
                    }

                    {
                        isStaff() && deleteTask && (
                            <button 
                            onClick={deleteTask}
                            className="btn btn-danger m-1">Delete</button>
                        )
                    }
                    
                    
                </div>
                <div className="form-row my-2">
                    <div className="col">
                        <label className="fw-bold">Task name</label>
                        <input type="text" placeholder="Enter project name" 
                            value={name}disabled={isStaff() ? false: true}
                            onChange={handleInputChange('name')}
                            className="form-control" />
                    </div>
                </div>
                <div className="row my-2">
                    <div className="col-md-6 col-12">
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect1" className="fw-bold">State</label>
                            <select 
                                value={state}
                                disabled={isStaff() ? false: true}
                                onChange={handleInputChange('state')} class="form-control" id="exampleFormControlSelect1">
                                {/* <option selected disabled>Select state</option> */}
                                <option value="NEW">NEW</option>
                                <option value="IN PROGRESS">IN PROGRESS</option>
                                <option value="CLOSED">CLOSED</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6 col-12">
                        <div className="form-group">
                            <label htmlFor="" className="fw-bold">Assigned To</label>
                            <input 
                            placeholder="Assign to"
                            value={email}
                            disabled={isStaff() ? false: true}
                            onChange={onEmailChange}
                            type="text" className="form-control" name="" id="" />
                            {/* suggestion dropdown */}
                            <div className="username-input">
                                <div className="username-dropdown border">
                                    <ul class="list-group">
                                        {
                                            users.length > 0 && users.map(each => (
                                                <li key={each.id} 
                                                style={{cursor: "pointer"}}
                                                onClick={e => {setAssignedTo(each.id); setEmail(each.email); setUsers([])}}
                                                class="list-group-item">{each.email}</li>
                                            ))
                                        }
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row my-2">
                    <div className="form-group col-md-6 col-sm-12">
                        <label className="fw-bold">Description</label>
                        <textarea 
                        style={{height: "300px"}}
                        value={description}
                        disabled={isStaff() ? false: true}
                        onChange={handleInputChange('description')}
                        className="form-control" placeholder="Enter project description"></textarea>
                    </div>
                    <div className="form-group col-md-6 col-sm-12">
                        <div className="form-row my-2">
                            <label className="fw-bold">Start Date</label>
                            <input type="date" 
                            value={start_date}
                            disabled={isStaff() ? false: true}
                            onChange={handleInputChange('start_date')}
                            placeholder="Select start date" className="form-control" />
                        </div>
                        <div className="form-row my-2">
                            <label className="fw-bold">End Date</label>
                            <input 
                            value={end_date}
                            disabled={isStaff() ? false: true}
                            onChange={handleInputChange('end_date')}
                            type="date" placeholder="Select End date" className="form-control" />
                        </div>
                        {
                            !createNewTask && (
                                <div className="form-row my-2">
                                    <label className="fw-bold">Sub-Tasks</label>
                                    {
                                        children.map(child => (
                                            <a style={{display: 'block'}} key={child.id} href={`/project/${match.params?.id}/task/${child.id}`}>
                                                {child.name.slice(0,50)}...
                                            </a>

                                        ))
                                    }
                                    {
                                        next && (
                                            <p onClick={() => {getNewSubTasks(next)}}>More..</p>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                {
                    createNewTask && (
                        <div className="form-group">
                            <button 
                            disabled={!name || !description || !start_date || !end_date}
                            onClick={createNewTask}
                            className="btn btn-primary d-block form-control fw-bold">Create</button>
                        </div>
                    )
                }
                
                
            </form>
        </div>
    );
};

export default TaskGrid;