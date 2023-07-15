import React, { ReactNode } from "react";
import MainNavigation from "./MainNavigation";
import { Container, Header, Content, Footer, Panel, FlexboxGrid } from "rsuite";

const styles = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
}

const RootLayout = ({ children }: { children: ReactNode }) => {

    const [activeKey, setActiveKey] = React.useState(null);

    return (
        <>
            <Container style={styles as React.CSSProperties}>
                <Header>
                    <MainNavigation appearance="inverse" activeKey={activeKey} onSelect={setActiveKey} />
                </Header>
                <Content>
                    {children}
                </Content>
                <Footer>
                    <FlexboxGrid justify="center" align="middle" style={{ flex: 1 }}>
                        <Panel>
                            <p>© 2021 - Todos os direitos reservados</p>
                        </Panel>
                    </FlexboxGrid>
                </Footer>
            </Container>
        </>
    )
}

export default RootLayout