import React, {useEffect} from 'react';
import { Form, Button, ButtonToolbar, DatePicker, SelectPicker, Row, Col, Divider } from 'rsuite';
import ptBR from 'date-fns/locale/pt-BR';

const ChamadaForm = ({formValue, setFormValue, formRef, model, onCancel, onSubmit, submitting, selectPicker}:any) => {
    
    // const setFocus = () => {
    //     formRef.current.root.querySelector('input[name="name"]').focus();
    // }

    // useEffect(() => {
    //     setFocus();
    // }, []);
    
    return (
        <Form fluid model={model} ref={formRef} onSubmit={onSubmit} onChange={setFormValue} formValue={formValue}>
            <Row>
                <Col xs={24} sm={12} md={12} lg={4}>
                    <Form.Group controlId='classe_id'>
                        <Form.ControlLabel>Turma</Form.ControlLabel>
                        <Form.Control name="classe_id" accepter={SelectPicker} data={selectPicker} />
                    </Form.Group>
                </Col>
                <Col xs={24} sm={12} md={12} lg={5}>
                    <Form.Group controlId='dtaula'>
                        <Form.ControlLabel>Data da Aula</Form.ControlLabel>
                        <Form.Control autoFocus name="dtaula" accepter={DatePicker} format='dd/MM/yyyy' />
                    </Form.Group>
                </Col>
                <Col xs={24} sm={8} md={8} lg={5}>
                    <Form.Group controlId='qtde'>
                        <Form.ControlLabel>Quantidade de Aulas</Form.ControlLabel>
                        <Form.Control name="qtde" placeholder="Quantidade de aulas" type='number' />
                    </Form.Group>
                </Col>
                <Col xs={24} sm={8} md={8} lg={5}>
                    <Form.Group controlId='hrini'>
                        <Form.ControlLabel>Horário Inicial</Form.ControlLabel>
                        <Form.Control name="hrini" type="time" />
                    </Form.Group>
                </Col>
                <Col xs={24} sm={8} md={8} lg={5}>
                <Form.Group controlId='hrfim'>
                        <Form.ControlLabel>Horário Final</Form.ControlLabel>
                        <Form.Control name="hrfim" type="time" />
                    </Form.Group>
                </Col>
            </Row>
            
            <Divider />
            
            <Row>
                <Col xs={24} sm={12} md={6}>
                    <Form.Group controlId='actions'>
                        <ButtonToolbar>
                            <Button type='submit' appearance="primary" disabled={submitting}>
                                {submitting ? 'Salvando...' : 'Salvar'}
                            </Button>
                            <Button appearance="default" onClick={onCancel} disabled={submitting}>Cancelar</Button>
                        </ButtonToolbar>
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
}
    

export default ChamadaForm