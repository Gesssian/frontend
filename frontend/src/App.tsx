import Header from "components/Header";
import Breadcrumbs from "components/Breadcrumbs";
import ClimberPage from "pages/ClimberPage";
import ClimbersListPage from "pages/ClimbersListPage";
import {Route, Routes} from "react-router-dom";
import {Container, Row} from "reactstrap";
import HomePage from "pages/HomePage";
import {useState} from "react";
import {T_Climber} from "modules/types.ts";

function App() {

    const [climbers, setClimbers] = useState<T_Climber[]>([])

    const [selectedClimber, setSelectedClimber] = useState<T_Climber | null>(null)

    const [isMock, setIsMock] = useState(false);

    return (
        <>
            <Header/>
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs selectedClimber={selectedClimber}/>
                </Row>
                <Row>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/climbers/" element={<ClimbersListPage climbers={climbers} setClimbers={setClimbers} isMock={isMock} setIsMock={setIsMock} />} />
                        <Route path="/climbers/:id" element={<ClimberPage selectedClimber={selectedClimber} setSelectedClimber={setSelectedClimber} isMock={isMock} setIsMock={setIsMock} />} />
                    </Routes>
                </Row>
            </Container>
        </>
    )
}

export default App
