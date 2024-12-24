import {Button, Card, Col, Row} from "reactstrap";
import {E_ExpeditionStatus, T_Expedition} from "modules/types.ts";
import {formatDate} from "utils/utils.ts";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {acceptExpedition, fetchExpeditions, rejectExpedition} from "store/slices/expeditionsSlice.ts";

type Props = {
    expedition: T_Expedition
    index: number
}

const ExpeditionCard = ({expedition, index}:Props) => {

    const {is_superuser} = useAppSelector((state) => state.user)

    const dispatch = useAppDispatch()

    const handleAcceptExpedition = async (expedition_id) => {
        await dispatch(acceptExpedition(expedition_id))
        await dispatch(fetchExpeditions())
    }

    const handleRejectExpedition = async (expedition_id) => {
        await dispatch(rejectExpedition(expedition_id))
        await dispatch(fetchExpeditions())
    }

    const navigate = useNavigate()

    const openExpeditionPage = () => {
        navigate(`/expeditions/${expedition.id}`)
    }

    const STATUSES = {
        1: "Введен",
        2: "В работе",
        3: "Завершен",
        4: "Отменён",
        5: "Удалён"
    }

    return (
        <Card style={{padding: "10px"}}>
            <Row>
                <Col md={1}>
                    {index + 1}
                </Col>
                <Col md={1}>
                    {STATUSES[expedition.status]}
                </Col>
                <Col md={1}>
                    {expedition.cost}
                </Col>
                <Col md={1}>
                    {formatDate(expedition.date)}
                </Col>
                <Col>
                    {formatDate(expedition.date_created)}
                </Col>
                <Col>
                    {formatDate(expedition.date_formation)}
                </Col>
                <Col>
                    {formatDate(expedition.date_complete)}
                </Col>
                {!is_superuser &&
                    <Col>
                        <Button color="primary" onClick={openExpeditionPage}>Открыть</Button>
                    </Col>
                }
                {is_superuser &&
                    <>
                        <Col>
                            {expedition.owner}
                        </Col>
                        <Col>
                            {expedition.status == E_ExpeditionStatus.InWork && <Button color="primary" onClick={() => handleAcceptExpedition(expedition.id)}>Принять</Button>}
                        </Col>
                        <Col>
                            {expedition.status == E_ExpeditionStatus.InWork && <Button color="danger" onClick={() => handleRejectExpedition(expedition.id)}>Отклонить</Button>}
                        </Col>
                    </>
                }
            </Row>
        </Card>
    )
}

export default ExpeditionCard