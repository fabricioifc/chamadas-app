import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../helper/supabase";
import { Session } from "@supabase/supabase-js";
import { Button, ButtonToolbar, FlexboxGrid, Form, Panel, Schema, Message, Divider } from "rsuite";
import GitHub from '@rsuite/icons/legacy/GitHub';
import Loading from "../helper/Loading";

const LoginPage = () => {
    const [session, setSession] = useState<Session | null | undefined>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formValue, setFormValue] = React.useState({email: '', password: ''} as any)
    const formRef = React.useRef<any>();

    const model = Schema.Model({
        email: Schema.Types.StringType().isRequired('Campo obrigatório').isEmail('Email inválido'),
        password: Schema.Types.StringType().isRequired('Campo obrigatório')
    })
    

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
          setSession(session)
        })
    
        supabase.auth.onAuthStateChange((event, session) => {
          setSession(session ?? null)
        })
    
    }, [])

    const handleLoginWithUsernameAndPassword = async () => {
        setLoading(true)
        try {
            if (!formRef.current.check()) return
            const { error } = await supabase.auth.signInWithPassword(formValue)
            if (error) throw error
            // navigate("/")
        } catch (error) {
            setError(error.message)
            throw error
        } finally {
            setLoading(false)
        }
    }



    const handleLoginWithGitHub = async () => {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "github"
            })
            if (error) throw error
            // navigate("/")
        } catch (error) {
            setError(error.message)
            throw error
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loading  />

    if (session) {
        return (
            <>
                <p>User: {session?.user?.email}</p>
                {/* <button onClick={handleLogout}>Logout</button> */}
            </>
        )
    }

    return (
        <div style={{marginTop: '20px'}}>
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={12}>
                    <Panel header={<h3>Login</h3>} bordered>
                        {error && (
                            <>
                                <Message type="error" showIcon>{error}</Message>
                                <Divider />
                            </>
                        )}
                        <Form 
                            fluid 
                            model={model} 
                            ref={formRef}
                            onSubmit={handleLoginWithUsernameAndPassword}
                            onChange={setFormValue}
                        >
                            <Form.Group>
                                <Form.ControlLabel>E-mail</Form.ControlLabel>
                                <Form.Control name="email" placeholder="E-mail" />
                            </Form.Group>
                            <Form.Group>
                                <Form.ControlLabel>Senha</Form.ControlLabel>
                                <Form.Control name="password" type="password" placeholder="Senha" autoComplete="off" />
                            </Form.Group>
                            <Form.Group>
                                <ButtonToolbar>
                                <Button type="submit" appearance="primary">Login</Button>
                                <Button appearance="link">Esqueceu sua senha?</Button>
                                </ButtonToolbar>
                            </Form.Group>
                            <hr />
                            <Form.Group>
                                <ButtonToolbar>
                                    <Button startIcon={<GitHub />} appearance="default" onClick={handleLoginWithGitHub}>Sign in with GitHub</Button>
                                </ButtonToolbar>
                            </Form.Group>
                        </Form>
                    </Panel>
                </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
    )

}

export default LoginPage;
