import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../helper/supabase';
import { Stack, Schema, Row, Col, Panel, Message } from 'rsuite';
import ClasseForm from '../../forms/ClasseForm';
import Classe from '../../types/Classe';
import Loading from '../../helper/Loading';

const { StringType } = Schema.Types;

const ClasseEditPage = () => {
    const params = useParams();
    const {id} = params;
    const isEditMode = !!id;
    
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const [formValue, setFormValue] = React.useState({} as Classe)
    const formRef = React.useRef<any>();
    const model = Schema.Model({
        name: StringType().isRequired('Campo obrigatório').maxLength(45, 'Máximo de 50 caracteres')
    })

    const navigate = useNavigate();

    const fetchClasse = async () => {
        setError(null);
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('classes')
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            setFormValue(data as Classe);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEditMode) fetchClasse();
        setLoading(false);
    }, [id]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            if (!formRef.current.check()) return
            if (isEditMode) {
                const { error } = await supabase
                .from('classes')
                .update(formValue)
                .eq('id', id);
            } else {
                const { error } = await supabase
                .from('classes')
                .insert(formValue);
            }

            if (error) throw error;
            navigate('/classes');
        } catch (error : any) {
            setError(error.message || "Ocorreu um erro inesperado.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) return <Loading />;

    return (
        <Stack direction='column' spacing={10} alignItems='center' justifyContent='center'>
            <Row>
                <Col xs={22} md={24}>
                    <Panel header={<h3>{isEditMode ? "Alterar" : "Nova"} classe</h3>} bordered>
                        {error && (<Message title='Alerta' type='error'>{error}</Message>)}
                        <ClasseForm
                            onCancel={() => navigate('/classes')}
                            onSubmit={handleSubmit}
                            submitting={isSubmitting}
                            setFormValue={setFormValue}
                            formValue={formValue}
                            formRef={formRef}
                            model={model}
                        />
                    </Panel>
                </Col>
            </Row>
        </Stack>
    )
}

export default ClasseEditPage;