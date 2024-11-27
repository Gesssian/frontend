import {Button, Card, CardBody, CardText, CardTitle, Col} from "reactstrap";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {addClimberToExpedition, fetchClimbers} from "store/slices/climbersSlice.ts";
import {T_Climber} from "utils/types.ts";
import {removeClimberFromDraftExpedition, updateClimberValue} from "store/slices/expeditionsSlice.ts";
import CustomInput from "components/CustomInput";
import {useEffect, useState} from "react";

type Props = {
    climber: T_Climber,
    showAddBtn?: boolean,
    showRemoveBtn?: boolean,
    showMM?: boolean,
    editMM?: boolean
}

export const ClimberCard = ({climber, showAddBtn = false, showRemoveBtn = false, showMM=false, editMM = false}:Props) => {

    const dispatch = useAppDispatch()

    const {save_mm} = useAppSelector(state => state.expeditions)

    const [local_count, setLocal_count] = useState(climber.count)

    const handeAddToDraftExpedition = async () => {
        await dispatch(addClimberToExpedition(climber.id))
        await dispatch(fetchClimbers())
    }

    const handleRemoveFromDraftExpedition = async () => {
        await dispatch(removeClimberFromDraftExpedition(climber.id))
    }

    useEffect(() => {
        dispatch(updateClimberValue({
            climber_id: climber.id,
            count: local_count
        }))
    }, [save_mm]);

    return (
        <Card key={climber.id} style={{width: '18rem' }}>
            <img
                alt=""
                src={climber.image}
                style={{"height": "200px"}}
            />
            <CardBody>
                <CardTitle tag="h5">
                    {climber.name}
                </CardTitle>
                <CardText>
                    Покорил: {climber.peak}.
                </CardText>
                {showMM && <CustomInput label="Количество" type="number" value={local_count} setValue={setLocal_count} disabled={!editMM} />}
                <Col className="d-flex justify-content-between">
                    <Link to={`/climbers/${climber.id}`}>
                        <Button color="primary" type="button">
                            Открыть
                        </Button>
                    </Link>
                    {showAddBtn &&
                        <Button color="secondary" onClick={handeAddToDraftExpedition}>
                            Добавить
                        </Button>
                    }
                    {showRemoveBtn &&
                        <Button color="danger" onClick={handleRemoveFromDraftExpedition}>
                            Удалить
                        </Button>
                    }
                </Col>
            </CardBody>
        </Card>
    );
};