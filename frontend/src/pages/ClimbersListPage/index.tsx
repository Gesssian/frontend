import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {T_Climber} from "src/modules/types.ts";
import ClimberCard from "components/ClimberCard";
import {ClimberMocks} from "src/modules/mocks.ts";
import {FormEvent, useEffect} from "react";
import * as React from "react";

type ClimbersListPageProps = {
    climbers: T_Climber[],
    setClimbers: React.Dispatch<React.SetStateAction<T_Climber[]>>
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
    climberName: string,
    setClimberName: React.Dispatch<React.SetStateAction<string>>
}

const ClimbersListPage = ({climbers, setClimbers, isMock, setIsMock, climberName, setClimberName}:ClimbersListPageProps) => {

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/climbers/?climber_name=${climberName.toLowerCase()}`,{ signal: AbortSignal.timeout(1000) })
            const data = await response.json()
            setClimbers(data.climbers)
            setIsMock(false)
        } catch {
            createMocks()
        }
    }

    const createMocks = () => {
        setIsMock(true)
        setClimbers(ClimberMocks.filter(climber => climber.name.toLowerCase().includes(climberName.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        if (isMock) {
            createMocks()
        } else {
            await fetchData()
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md="8">
                                <Input value={climberName} onChange={(e) => setClimberName(e.target.value)} placeholder="Поиск..."></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                {climbers?.map(climber => (
                    <Col key={climber.id} xs="4">
                        <ClimberCard climber={climber} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ClimbersListPage