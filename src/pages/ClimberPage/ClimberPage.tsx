import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchClimber, removeSelectedClimber} from "store/slices/climbersSlice.ts";

const ClimberPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const {climber} = useAppSelector((state) => state.climbers)

    useEffect(() => {
        dispatch(fetchClimber(id))
        return () => dispatch(removeSelectedClimber())
    }, []);

    if (!climber) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md="6">
                    <img
                        alt=""
                        src={climber.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{climber.name}</h1>
                    <p className="fs-5">Покорил: {climber.peak} </p>
                    <p className="fs-5">Описание: {climber.description}</p>
                </Col>
            </Row>
        </Container>
    );
};

export default ClimberPage