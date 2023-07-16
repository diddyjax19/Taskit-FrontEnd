import React,{useState} from 'react';
import { Navbar, Collapse, NavbarToggler } from 'reactstrap';
import {Link, useHistory} from 'react-router-dom';
import { isAuthenticated, signout,getEmail } from '../auth/helper';
import styled from "styled-components";

const StyledLink = styled(Link)`
color: white;
text-decoration: none;
margin: 0.5px;
position: relative;
`;

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const history = useHistory();

    return (
        <Navbar className="navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link href="/" className="navbar-brand fs-2">TaskMe</Link>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar className="collapse navbar-collapse justify-content-end">


                    <ul className="navbar-nav ml-auto">
                        {
                            // if user is authenticated
                            isAuthenticated() ? (
                                <>
                                    <li class="nav-item">
                                        <Link to="/" class="nav-link active" 
                                            aria-current="page" >{getEmail()}</Link>
                                    </li>
                                    
                                    <li class="nav-item" color='light'>
                                        
                                            <span class="nav-link active" 
                                                onClick={e => signout(() => history.push("/signin"))}
                                                aria-current="page" >Signout</span>
                                                
                                        
                                    </li>
                                    
                                    
                                </>
                            ): 
                            (
                                <>
                                    <li class="nav-item">
                                        <button type="button" class="btn btn-primary m-1">  
                                            <StyledLink class="nav-link active" className='fs-6 p-2' aria-current="page" to="/signin">Sign In</StyledLink>
                                        </button>
                                    </li>
                                    <li class="nav-item">
                                        <button type="button" class="btn btn-primary m-1">
                                            <StyledLink class="nav-link active" className='fs-6 p-2' aria-current="page" to="/signup">Sign Up</StyledLink>
                                        </button>
                                    </li>
                                </>                
                            )

                        }
                        
                    </ul>
                
                
                </Collapse>
            </div>

        </Navbar>
    );
};

export default Header;