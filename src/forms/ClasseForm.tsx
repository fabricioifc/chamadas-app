import React, {useEffect} from 'react';
import { Form, Button, ButtonToolbar } from 'rsuite';

const ClasseForm = ({formValue, setFormValue, formRef, model, onCancel, onSubmit, submitting}:any) => {
    
    // const setFocus = () => {
    //     formRef.current.root.querySelector('input[name="name"]').focus();
    // }

    // useEffect(() => {
    //     setFocus();
    // }, []);
    
    return (
        <Form layout='inline' fluid model={model} ref={formRef} onSubmit={onSubmit} onChange={setFormValue} formValue={formValue}>
            <Form.Group controlId='name'>
                <Form.ControlLabel>Nome da classe</Form.ControlLabel>
                <Form.Control autoFocus name="name" placeholder="Nome da classe" />
            </Form.Group>
            <Form.Group>
                <ButtonToolbar>
                    <Button type='submit' appearance="primary" disabled={submitting}>
                        {submitting ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button appearance="default" onClick={onCancel} disabled={submitting}>Cancelar</Button>
                </ButtonToolbar>
            </Form.Group>
        </Form>
    );
}
    

export default ClasseForm;