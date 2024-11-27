import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchClimber, removeSelectedClimber} from "store/slices/climbersSlice.ts";


export const ClimberPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const selectedClimber = useAppSelector((state) => state.climbers.selectedClimber)

    useEffect(() => {
        dispatch(fetchClimber(id))
        return () => dispatch(removeSelectedClimber())
    }, []);

    if (!selectedClimber) {
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
                        src={selectedClimber.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{selectedClimber.name}</h1>
                    <p className="fs-5">Покорил: {selectedClimber.peak}.</p>
                    <p className="fs-5">Описание: {selectedClimber.description}</p>
                </Col>
            </Row>
        </Container>
    );
};