import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import ClimberCard from "components/ClimberCard";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchClimbers, updateClimberName} from "store/slices/climbersSlice.ts";
import Bin from "components/Bin";

export const ClimbersListPage = () => {

    const dispatch = useAppDispatch()

    const climbers = useAppSelector((state) => state.climbers.climbers)

    const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated)

    const {draft_expedition_id, climbers_count} = useAppSelector((state) => state.expeditions)

    const hasDraft = draft_expedition_id != null

    const query = useAppSelector((state) => state.climbers.query)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateClimberName(e.target.value))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(fetchClimbers())
    }

    useEffect(() => {
        dispatch(fetchClimbers())
    }, [])

    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs="8">
                                <Input value={query} onChange={handleChange} placeholder="Поиск..."></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                {isAuthenticated &&
                    <Col className="d-flex flex-row justify-content-end" md="6">
                        <Bin isActive={hasDraft} draft_expedition_id={draft_expedition_id} climbers_count={climbers_count} />
                    </Col>
                }
            </Row>
            <Row className="mt-5 d-flex">
                {climbers?.map(climber => (
                    <Col key={climber.id} className="mb-5 d-flex justify-content-center" sm="12" md="6" lg="4">
                        <ClimberCard climber={climber} showAddBtn={isAuthenticated} showMM={false} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};