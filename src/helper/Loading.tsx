import React from 'react';
import { FlexboxGrid, Panel, Placeholder, Loader } from 'rsuite';

const Loading = ({title = 'Loading...'}) => {
    return (
        <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={12}>
                    <Panel header={<h3>{title}</h3>} bordered>
                        <Placeholder.Paragraph rows={8} active />
                        <Loader backdrop center content="loading..." vertical />
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>
    );
}

export default Loading;