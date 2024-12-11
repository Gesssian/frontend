import {useNavigate} from "react-router-dom";
import {useMemo} from "react";
import {Button} from "reactstrap";
import {T_Climber} from "modules/types.ts";
import CustomTable from "components/CustomTable/CustomTable.tsx";
import {deleteClimber} from "store/slices/climbersSlice.ts";
import {useAppDispatch} from "store/store.ts";

type Props = {
    climbers:T_Climber[]
}

const ClimbersTable = ({climbers}:Props) => {

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const handleClick = (climber_id) => {
        navigate(`/climbers/${climber_id}`)
    }

    const openpRroductEditPage = (climber_id) => {
        navigate(`/climbers/${climber_id}/edit`)
    }

    const handleDeleteClimber = async (climber_id) => {
        dispatch(deleteClimber(climber_id))
    }

    const columns = useMemo(
        () => [
            {
                Header: '№',
                accessor: 'id',
            },
            {
                Header: 'Название',
                accessor: 'name',
                Cell: ({ value }) => value
            },
            {
                Header: 'Покорил',
                accessor: 'peak',
                Cell: ({ value }) => value
            },
            {
                Header: "Действие",
                accessor: "edit_button",
                Cell: ({ cell }) => (
                    <Button color="primary" onClick={() => openpRroductEditPage(cell.row.values.id)}>Редактировать</Button>
                )
            },
            {
                Header: "Удалить",
                accessor: "delete_button",
                Cell: ({ cell }) => (
                    <Button color="danger" onClick={() => handleDeleteClimber(cell.row.values.id)}>Удалить</Button>
                )
            }
        ],
        []
    )

    if (!climbers.length) {
        return (
            <></>
        )
    }

    return (
        <CustomTable columns={columns} data={climbers} onClick={handleClick} />
    )
};

export default ClimbersTable