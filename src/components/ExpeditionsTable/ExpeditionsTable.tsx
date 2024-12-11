import {useNavigate} from "react-router-dom";
import {useMemo} from "react";
import {formatDate} from "src/utils/utils.ts";
import CustomTable from "components/CustomTable/CustomTable.tsx";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {Button} from "reactstrap";
import {Expedition} from "src/api/Api.ts";
import {acceptExpedition, fetchExpeditions, rejectExpedition} from "store/slices/expeditionsSlice.ts";

type Props = {
    expeditions:Expedition[]
}

const ExpeditionsTable = ({expeditions}:Props) => {

    const {is_superuser} = useAppSelector((state) => state.user)

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const handleClick = (expedition_id) => {
        navigate(`/expeditions/${expedition_id}`)
    }

    const handleAcceptExpedition = async (expedition_id) => {
        await dispatch(acceptExpedition(expedition_id))
        await dispatch(fetchExpeditions())
    }

    const handleRejectExpedition = async (expedition_id) => {
        await dispatch(rejectExpedition(expedition_id))
        await dispatch(fetchExpeditions())
    }

    const STATUSES = {
        1: "Черновик",
        2: "В работе",
        3: "Завершен",
        4: "Отменён",
        5: "Удалён"
    }

    const columns = useMemo(
        () => [
            {
                Header: '№',
                accessor: 'id',
            },
            {
                Header: 'Статус',
                accessor: 'status',
                Cell: ({ value }) => STATUSES[value]
            },
            {
                Header: 'Дата',
                accessor: 'date',
                Cell: ({ value }) => formatDate(value, {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
            },
            {
                Header: 'Дата создания',
                accessor: 'date_created',
                Cell: ({ value }) => formatDate(value)
            },
            {
                Header: 'Дата формирования',
                accessor: 'date_formation',
                Cell: ({ value }) => formatDate(value)
            },
            {
                Header: 'Дата завершения',
                accessor: 'date_complete',
                Cell: ({ value }) => formatDate(value)
            }
        ],
        []
    )

    if (is_superuser) {
        columns.push(
            {
                Header: "Пользователь",
                accessor: "owner",
                Cell: ({ value }) => value
            },
            {
                Header: "Действие",
                accessor: "accept_button",
                Cell: ({ cell }) => (
                    cell.row.values.status == 2 && <Button color="primary" onClick={() => handleAcceptExpedition(cell.row.values.id)}>Принять</Button>
                )
            },
            {
                Header: "Действие",
                accessor: "decline_button",
                Cell: ({ cell }) => (
                    cell.row.values.status == 2 && <Button color="danger" onClick={() => handleRejectExpedition(cell.row.values.id)}>Отклонить</Button>
                )
            }
        )
    }

    return (
        <CustomTable columns={columns} data={expeditions} onClick={handleClick}/>
    )
};

export default ExpeditionsTable