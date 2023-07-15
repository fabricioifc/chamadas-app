import React from "react";
import { useAuth } from "../hooks/Auth";
import { NavLink } from 'react-router-dom';
import { IconButton, Nav, Navbar, Tag, Avatar } from 'rsuite';
import HomeIcon from '@rsuite/icons/legacy/Home';
import OffRoundIcon from '@rsuite/icons/OffRound';
import AdminIcon from '@rsuite/icons/Admin';
import PeoplesMap from '@rsuite/icons/PeoplesMap';


const MainNavigation = ({onSelect, activeKey, ...props}) => {
    const { user, signOut } = useAuth();
    const handleLogout = async () => signOut();

    return (
        <Navbar {...props}>
            <Navbar.Brand href="/">
                <Avatar circle src="https://avatars.githubusercontent.com/u/15609339" alt="@hiyangguo" />
            </Navbar.Brand>
            <Nav onSelect={onSelect} activeKey={activeKey}>
                {/* <Nav.Item eventKey="1" to="/" as={NavLink} icon={<HomeIcon />}>Home</Nav.Item> */}
                {!user && 
                    (<>
                        <Nav.Item eventKey="2" to="/login" as={NavLink}>Login</Nav.Item>
                        <Nav.Item eventKey="3" to="/register" as={NavLink}>Register</Nav.Item>
                    </>)
                }
                {user &&
                    (<>
                        <Nav.Item eventKey="4" to="/classes" as={NavLink} icon={<PeoplesMap />}>
                            <Tag color="orange">Classes</Tag>
                        </Nav.Item>
                        <Nav.Item eventKey="5" to="/chamadas" as={NavLink} icon={<AdminIcon />}>
                            <Tag color="green">Chamadas</Tag>
                        </Nav.Item>
                    </>)
                
                }
            </Nav>
            <Nav pullRight>
                {user &&
                    (<>
                        <Nav.Item onClick={handleLogout} icon={<OffRoundIcon />}>
                            <Tag color="red">Logout</Tag>
                        </Nav.Item>
                    </>)
                }
            </Nav>
        </Navbar>
    )
}

export default MainNavigation