import {useState} from "react";
import Header from "components/Header";
import Breadcrumbs from "components/Breadcrumbs";
import ClimberPage from "pages/ClimberPage";
import ClimbersListPage from "pages/ClimbersListPage";
import {Route, Routes} from "react-router-dom";
import {T_Climber} from "src/modules/types.ts";
import {Container, Row} from "reactstrap";
import HomePage from "pages/HomePage";
import "./styles.css"

function App() {

    const [climbers, setClimbers] = useState<T_Climber[]>([])

    const [selectedClimber, setSelectedClimber] = useState<T_Climber | null>(null)

    const [isMock, setIsMock] = useState(false);

    const [climberName, setClimberName] = useState<string>("")

    return (
        <div>
            <Header/>
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs selectedClimber={selectedClimber} />
                </Row>
                <Row>
                    <Routes>
						<Route path="/" element={<HomePage />} />
                        <Route path="/climbers/" element={<ClimbersListPage climbers={climbers} setClimbers={setClimbers} isMock={isMock} setIsMock={setIsMock} climberName={climberName} setClimberName={setClimberName}/>} />
                        <Route path="/climbers/:id" element={<ClimberPage selectedClimber={selectedClimber} setSelectedClimber={setSelectedClimber} isMock={isMock} setIsMock={setIsMock}/>} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
