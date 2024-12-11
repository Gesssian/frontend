import {Button, Card, CardBody, CardText, CardTitle, Col, Row} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {T_Climber} from "modules/types.ts";
import {
    removeClimberFromDraftExpedition,
    updateClimberValue
} from "store/slices/expeditionsSlice.ts";
import {useEffect, useState} from "react";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import {addClimberToExpedition, fetchClimbers} from "store/slices/climbersSlice.ts";

type Props = {
    climber: T_Climber,
    showAddBtn?: boolean,
    showRemoveBtn?: boolean,
    editMM?: boolean
}

const ClimberCard = ({climber, showAddBtn=false, showRemoveBtn=false, editMM=false}:Props) => {

    const dispatch = useAppDispatch()

    const {is_superuser} = useAppSelector((state) => state.user)

    const {save_mm} = useAppSelector(state => state.expeditions)

    const [local_count, setLocal_count] = useState(climber.count)

    const location = useLocation()

    const isExpeditionPage = location.pathname.includes("expeditions")

    const handeAddToDraftExpedition = async () => {
        await dispatch(addClimberToExpedition(climber.id))
        await dispatch(fetchClimbers())
    }

    const handleRemoveFromDraftExpedition = async () => {
        await dispatch(removeClimberFromDraftExpedition(climber.id))
    }

    useEffect(() => {
        save_mm && updateValue()
    }, [save_mm]);

    const updateValue = async () => {
        dispatch(updateClimberValue({
            climber_id: climber.id,
            count: local_count
        }))
    }

    if (isExpeditionPage) {
        return (
            <Card key={climber.id}>
                <Row>
                    <Col>
                        <img
                            alt=""
                            src={climber.image}
                            style={{"width": "100%"}}
                        />
                    </Col>
                    <Col md={8}>
                        <CardBody>
                            <CardTitle tag="h5">
                                {climber.name}
                            </CardTitle>
                            <CardText>
                                Покорил: {climber.peak} 
                            </CardText>
                            <CustomInput label="Количество экспедиций" type="number" value={local_count} setValue={setLocal_count} disabled={!editMM || is_superuser} className={"w-25"}/>
                            <Col className="d-flex gap-5">
                                <Link to={`/climbers/${climber.id}`}>
                                    <Button color="primary" type="button">
                                        Открыть
                                    </Button>
                                </Link>
                                {showRemoveBtn &&
                                    <Button color="danger" onClick={handleRemoveFromDraftExpedition}>
                                        Удалить
                                    </Button>
                                }
                            </Col>
                        </CardBody>
                    </Col>
                </Row>
            </Card>
        );
    }

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
                    Покорил: {climber.peak} 
                </CardText>
                <Col className="d-flex justify-content-between">
                    <Link to={`/climbers/${climber.id}`}>
                        <Button color="primary" type="button">
                            Открыть
                        </Button>
                    </Link>
                    {!is_superuser && showAddBtn &&
                        <Button color="secondary" onClick={handeAddToDraftExpedition}>
                            Добавить
                        </Button>
                    }
                </Col>
            </CardBody>
        </Card>
    );
};

export default ClimberCard