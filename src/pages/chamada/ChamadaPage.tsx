import React, { useEffect, useState } from 'react';
import { supabase } from '../../helper/supabase';
import Chamada from '../../types/Chamada';
import { useAuth } from '../../hooks/Auth';
import { FlexboxGrid, Panel, Row, Col, Tag, IconButton } from 'rsuite';
import { Link } from 'react-router-dom';
import { Button, Stack } from 'rsuite';
import PlusRound from '@rsuite/icons/PlusRound';
import TrashIcon from '@rsuite/icons/Trash';
import { useNavigate } from 'react-router-dom';

import { Table } from 'rsuite';
import Loading from '../../helper/Loading';
const { Column, HeaderCell, Cell } = Table;

const tableName = 'chamadas';
const title = 'Chamadas'

const ChamadaPage = () => {
    // const { user } = useAuth();
    const [list, setList] = useState<Chamada[]>([]);
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
                .from(tableName)
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
        navigate(`/${tableName}/${id}/edit`);
        
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                let { data: lista, error } = await supabase
                .from('chamadas')
                .select(`
                    id, dtaula, qtde, hrini, hrfim, classe_id,
                    classes (
                        id, name
                    )
                `)
                if (error) throw error;
                setList(lista as Chamada[] || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
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
    

    if (loading) return <Loading title={tableName} />
    if (error) return <p>{error}</p>;

    return (
        <FlexboxGrid justify="center">
            <FlexboxGrid.Item as={Col} colspan={24}>
                <Panel 
                    header={
                        <Stack direction="row" spacing={10} justifyContent='space-around'>
                            <Tag color="green">{title}</Tag>
                            <Button to={`/${tableName}/new`} as={Link} appearance="primary" startIcon={<PlusRound />}>
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
                        autoHeight
                        affixHeader
                        affixHorizontalScrollbar
                    >
                        <Column align="center" flexGrow={1} fixed>
                            <HeaderCell>#</HeaderCell>
                            <Cell>
                                {rowData => <Link to={`/${tableName}/${rowData.id}/edit`}>{rowData.id}</Link>}
                            </Cell>
                        </Column>

                        <Column align='left' flexGrow={2} sortable>
                            <HeaderCell>Data</HeaderCell>
                            <Cell>
                                {rowData => new Date(rowData.dtaula).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                            </Cell>
                            </Column>
                        <Column align='left' flexGrow={1}>
                            <HeaderCell>Aulas</HeaderCell>
                            <Cell dataKey="qtde" />
                        </Column>

                        <Column align='left' flexGrow={2}>
                            <HeaderCell>Horário</HeaderCell>
                            <Cell>{(rowData) => rowData.hrini.substr(0,5) + ' - ' + rowData.hrfim.substr(0,5)}</Cell>
                        </Column>

                        <Column align='left' flexGrow={2} sortable>
                            <HeaderCell>Turma</HeaderCell>
                            <Cell dataKey="classes.name" />
                        </Column>

                        <Column align="center" flexGrow={1}>
                            <HeaderCell>Ações</HeaderCell>
                            <Cell>
                                {(rowData) => {
                                    return (
                                        <IconButton onClick={() => handleDelete(rowData.id)} icon={<TrashIcon />} size="xs" appearance='ghost' color='red' />
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

export default ChamadaPage