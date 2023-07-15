import React from "react";
import { useAuth } from "../hooks/Auth";
import { Panel, Message, Button } from "rsuite";
import { Link } from "react-router-dom";
import { PlusRound } from "@rsuite/icons";

const ProtectedRoute = ({ children } : any) => {
    const { user } = useAuth();
    
    return (
        <>
            {user ? children : (
                <Panel>
                    <Message showIcon header='Alerta' type='error'>
                        Você não tem permissão para acessar essa página.
                    </Message>
                </Panel>
            )}
        </>
    )
}

export default ProtectedRoute