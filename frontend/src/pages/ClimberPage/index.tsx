import * as React from 'react';
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {T_Climber} from "src/modules/types.ts";
import {Col, Container, Row} from "reactstrap";
import {ClimberMocks} from "src/modules/mocks.ts";
import mockImage from "assets/mock.png";

type ClimberPageProps = {
    selectedClimber: T_Climber | null,
    setSelectedClimber: React.Dispatch<React.SetStateAction<T_Climber | null>>,
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const ClimberPage = ({selectedClimber, setSelectedClimber, isMock, setIsMock}: ClimberPageProps) => {
    const { id } = useParams<{id: string}>();

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/climbers/${id}`,{ signal: AbortSignal.timeout(100) })
            const data = await response.json()
            setSelectedClimber(data)
        } catch {
            createMock()
        }
    }

    const createMock = () => {
        setIsMock(true)
        setSelectedClimber(ClimberMocks.find(climber => climber?.id == parseInt(id as string)) as T_Climber)
    }

    useEffect(() => {
        if (!isMock) {
            fetchData()
        } else {
            createMock()
        }

        return () => setSelectedClimber(null)
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
                        src={isMock ? mockImage as string : selectedClimber.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{selectedClimber.name}</h1>
                    <p className="fs-5">Описание: {selectedClimber.description}</p>
                    <p className="fs-5">Покорил: {selectedClimber.peak}.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default ClimberPage