import React from 'react';
import { Message, Placeholder } from 'rsuite';


const styles = {
  background: '#000',
  padding: 20,
};

const PageNotFound = () => (
  <div style={styles}>
    <Message showIcon type="warning">
      Página não encontrada
    </Message>
    <Placeholder.Paragraph rows={10} />
  </div>
);

export default PageNotFound;