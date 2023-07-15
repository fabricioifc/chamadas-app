import React, { useEffect, useState } from 'react';
import { supabase } from '../../helper/supabase';
import Classe from '../../types/Classe';
import { useAuth } from '../../hooks/Auth';
import { FlexboxGrid, Panel, Row, Col } from 'rsuite';
import { Link } from 'react-router-dom';
import { Button, Stack } from 'rsuite';
import PlusRound from '@rsuite/icons/PlusRound';
import TrashIcon from '@rsuite/icons/Trash';
import EditIcon from '@rsuite/icons/Edit';
import { useNavigate } from 'react-router-dom';

import { Table } from 'rsuite';
import Loading from '../../helper/Loading';
const { Column, HeaderCell, Cell } = Table;

const ClassePage = () => {
    const { user } = useAuth();
    const [list, setList] = useState<Classe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortType, setSortType] = useState();
    const navigate = useNavigate();

    const handleDelete = async (id: number) => {
        setError(null);
        setIsDeleting(true);
        try {
            const { data: x, error } = await supabase
                .from('classes')
                .delete()
                .match({ id })
            if (error) throw error;
            setList(list.filter((item) => item.id !== id));
        } catch (error) {
            setError(error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (id: number) => {
        setError(null);
        navigate(`/classes/${id}/edit`);
        
    };

    useEffect(() => {
        const fetchClasse = async () => {
            try {
                const { data: lista, error } = await supabase
                    .from('classes')
                    .select('*');
                if (error) throw error;
                setList(lista ?? []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchClasse();
    }, []);

    const getData = () => {
        if (sortColumn && sortType) {
            return list.sort((a, b) => {
                const x = a[sortColumn];
                const y = b[sortColumn];
                if (typeof x === 'string') {
                    return sortType === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
                }
                if (typeof x === 'number') {
                    return sortType === 'asc' ? x - y : y - x;
                }
                return 0;
            });
        }
        return list;
    };

    const handleSortColumn = (sortColumn, sortType) => {
        setLoading(true);
        setSortColumn(sortColumn);
        setSortType(sortType);
        setLoading(false);
    };
    

    if (loading) return <Loading title='Classes' />
    if (error) return <p>{error}</p>;

    return (
        <FlexboxGrid justify="center">
            <FlexboxGrid.Item colspan={20}>
                <Panel 
                
                    bordered 
                    header={
                        <Stack direction="row" spacing={20} justifyContent='space-between'>
                            <span>Classes</span>
                            <Button to="/classes/new" as={Link} appearance="primary" startIcon={<PlusRound />}>
                                Adicionar
                            </Button>
                        </Stack>
                    }
                    >
                    <Table
                        height={400}
                        data={getData()}
                        onSortColumn={handleSortColumn}
                        sortColumn={sortColumn}
                        sortType={sortType}
                    >
                        <Column align="center" flexGrow={1}>
                            <HeaderCell>#</HeaderCell>
                            <Cell dataKey="id" />
                        </Column>

                        <Column align='left' flexGrow={7} sortable>
                            <HeaderCell>Nome</HeaderCell>
                            <Cell dataKey="name" />
                        </Column>

                        <Column align="center" flexGrow={3}>
                            <HeaderCell>Ações</HeaderCell>
                            <Cell>
                                {(rowData) => {
                                    return (
                                        <Row>
                                            <Col>
                                                <Button disabled={isDeleting} onClick={() => handleEdit(rowData.id)} appearance="ghost" color="green" size="xs" startIcon={<EditIcon/>}>
                                                    Alterar
                                                </Button>
                                                {' '}
                                                <Button disabled={isDeleting} onClick={() => handleDelete(rowData.id)} appearance="ghost" color="red" size="xs" startIcon={<TrashIcon/>}>
                                                    Remover
                                                </Button>
                                            </Col>
                                        </Row>
                                    );
                                }}
                            </Cell>
                        </Column>

                    </Table>
                </Panel>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default ClassePage