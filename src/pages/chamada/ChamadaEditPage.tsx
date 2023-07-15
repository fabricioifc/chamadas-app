import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../helper/supabase';
import { FlexboxGrid, Col, Panel, Tag, Stack, Message, Schema } from 'rsuite';
import Loading from '../../helper/Loading';
import ChamadaForm from '../../forms/ChamadaForm';
import Chamada from '../../types/Chamada';

const { StringType, DateType, NumberType } = Schema.Types;
const title = 'Chamada';
const tableName = 'chamadas';

const initialValue = {
    dtaula: new Date(),
    qtde: 2,
    hrini: '08:20',
    hrfim: '10:00',
} as Chamada;

const ChamadaEditPage = () => {
    const params = useParams();
    const {id} = params;
    const isEditMode = !!id;
    
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const [formValue, setFormValue] = React.useState<Chamada>({...initialValue})
    const [classes, setClasses] = React.useState<any[]>([])
    const formRef = React.useRef<any>();
    const model = Schema.Model({
        dtaula: DateType().isRequired('Campo obrigatório'),
        qtde: NumberType().isRequired('Campo obrigatório'),
        hrini: StringType().isRequired('Campo obrigatório'),
        hrfim: StringType().isRequired('Campo obrigatório').addRule((value, data) => {
            return value > data.hrini
        }
        , 'Horário final deve ser maior que o inicial'),
        classe_id: NumberType().isRequired('Campo obrigatório')
    })

    const navigate = useNavigate();

    const fetchOne = async () => {
        setError(null);
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .eq('id', id)
                .single();
            if (error) throw error;
            setFormValue({...data, dtaula: Date.parse(data.dtaula)} as Chamada);
            console.log('data', data.dtaula);
            
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const { data, error } = await supabase
                .from('classes')
                .select('id, name')
                .order('name', { ascending: true });
            if (error) throw error;
            console.log(data);
            setClasses(data && data.map((item: any) => ({label: item.name, value: item.id})));
        } catch (error) {
            setError(error.message);
        } 
    };

    useEffect(() => {
        if (isEditMode) fetchOne();
        fetchClasses();
        setLoading(false);
    }, [id]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            if (!formRef.current.check()) return
            console.log(formValue);
            
            if (isEditMode) {
                const { error } = await supabase
                .from(tableName)
                .update(formValue)
                .eq('id', id);
            } else {
                const { error } = await supabase
                .from(tableName)
                .insert(formValue);
            }

            if (error) throw error;
            navigate('/{}'.replace('{}', tableName));
        } catch (error : any) {
            setError(error.message || "Ocorreu um erro inesperado.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) return <Loading />;

    return (
        <FlexboxGrid justify="center">
            <FlexboxGrid.Item as={Col} colspan={24} style={{marginTop: '5px'}}>
                <Panel
                    bordered
                    header={
                        <Stack direction="row" spacing={10} justifyContent='space-around'>
                            <Tag color="green">{title}</Tag>
                        </Stack>
                    }
                >
                    {error && <Message type="error">{error}</Message>}
                    <ChamadaForm
                        formValue={formValue}
                        setFormValue={setFormValue}
                        formRef={formRef}
                        model={model}
                        onCancel={() => navigate('/chamadas')}
                        onSubmit={handleSubmit}
                        submitting={isSubmitting}
                        selectPicker={classes}
                    />
                </Panel>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default ChamadaEditPage