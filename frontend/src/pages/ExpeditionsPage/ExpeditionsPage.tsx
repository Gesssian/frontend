import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchExpeditions, T_expeditionsFilters, updateFilters} from "store/slices/expeditionsSlice.ts";
import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {ExpeditionsTable} from "components/ExpeditionsTable/ExpeditionsTable.tsx";
import {useNavigate} from "react-router-dom";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.tsx";

export const ExpeditionsPage = () => {

    const dispatch = useAppDispatch()

    const expeditions = useAppSelector((state) => state.expeditions.expeditions)

    const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated)

    const filters = useAppSelector<T_expeditionsFilters>((state) => state.expeditions.filters)

    const navigate = useNavigate()

    const [status, setStatus] = useState(filters.status)

    const [dateFormationStart, setDateFormationStart] = useState(filters.date_formation_start)

    const [dateFormationEnd, setDateFormationEnd] = useState(filters.date_formation_end)

    const statusOptions = {
        0: "Любой",
        2: "В работе",
        3: "Завершен",
        4: "Отклонен"
    }

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/403/")
        }
    }, [isAuthenticated]);

    useEffect(() => {
        dispatch(fetchExpeditions())
    }, []);

    const applyFilters = async (e) => {
        e.preventDefault()

        const filters:T_expeditionsFilters = {
            status: status,
            date_formation_start: dateFormationStart,
            date_formation_end: dateFormationEnd
        }

        await dispatch(updateFilters(filters))
        await dispatch(fetchExpeditions())
    }

    return (
        <Container>
            <Form onSubmit={applyFilters}>
                <Row className="mb-4 d-flex align-items-center">
                    <Col md="2" className="d-flex flex-row gap-3 align-items-center">
                        <label>От</label>
                        <Input type="date" value={dateFormationStart} onChange={(e) => setDateFormationStart(e.target.value)} required/>
                    </Col>
                    <Col md="2" className="d-flex flex-row gap-3 align-items-center">
                        <label>До</label>
                        <Input type="date" value={dateFormationEnd} onChange={(e) => setDateFormationEnd(e.target.value)} required/>
                    </Col>
                    <Col md="3">
                        <CustomDropdown label="Статус" selectedItem={status} setSelectedItem={setStatus} options={statusOptions} />
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button color="primary" type="submit">Применить</Button>
                    </Col>
                </Row>
            </Form>
            {expeditions.length ? <ExpeditionsTable expeditions={expeditions}/> : <h3 className="text-center mt-5">Экспедиции не найдены</h3>}
        </Container>
    )
};