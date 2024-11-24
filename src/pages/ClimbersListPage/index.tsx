import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import ClimberCard from "components/ClimberCard";
import {ChangeEvent, FormEvent, useEffect} from "react";
import * as React from "react";
import {useAppSelector} from "src/store/store.ts";
import {updateClimberName} from "src/store/slices/climbersSlice.ts";
import {T_Climber} from "modules/types.ts";
import {ClimberMocks} from "modules/mocks.ts";
import {useDispatch} from "react-redux";

type Props = {
    climbers: T_Climber[],
    setClimbers: React.Dispatch<React.SetStateAction<T_Climber[]>>
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const ClimbersListPage = ({climbers, setClimbers, isMock, setIsMock}:Props) => {

    const dispatch = useDispatch()

    const {climber_name} = useAppSelector((state) => state.climbers)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateClimberName(e.target.value))
    }

    const createMocks = () => {
        setIsMock(true)
        setClimbers(ClimberMocks.filter(climber => climber.name.toLowerCase().includes(climber_name.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        await fetchClimbers()
    }

    const fetchClimbers = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/climbers/?climber_name=${climber_name.toLowerCase()}`)
            const data = await response.json()
            setClimbers(data.climbers)
            setIsMock(false)
        } catch {
            createMocks()
        }
    }

    useEffect(() => {
        fetchClimbers()
    }, []);

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
            </Row>
            <Row>
                {climbers?.map(climber => (
                    <Col key={climber.id} sm="12" md="6" lg="4">
                        <ClimberCard climber={climber} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ClimbersListPage