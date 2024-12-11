import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchClimbers, updateClimberName} from "store/slices/climbersSlice.ts";
import {Link, useNavigate} from "react-router-dom";
import ClimbersTable from "components/ClimbersTable/ClimbersTable.tsx";

const ClimbersTablePage = () => {

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const {is_authenticated, is_superuser} = useAppSelector((state) => state.user)

    const {climbers, climber_name} = useAppSelector((state) => state.climbers)

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

    useEffect(() => {
        if (!is_superuser) {
            navigate("/403/")
        }
    }, [is_authenticated, is_superuser]);

    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs="8">
                                <Input value={climber_name} onChange={handleChange} placeholder="Поиск..."></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col className="d-flex flex-row justify-content-end" md="6">
                    <Link to="/climbers/add">
                        <Button color="primary">Новый альпинист</Button>
                    </Link>
                </Col>
            </Row>
            <Row className="mt-5 d-flex">
                {climbers.length > 0 ? <ClimbersTable climbers={climbers} fetchClimbers={fetchClimbers}/> : <h3 className="text-center mt-5">Альпинисты не найдены</h3>}
            </Row>
        </Container>
    );
};

export default ClimbersTablePage