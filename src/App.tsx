import {Route, Routes} from "react-router-dom";
import {Container, Row} from "reactstrap";
import "./styles.css"
import HomePage from "pages/HomePage/HomePage.tsx";
import LoginPage from "pages/LoginPage/LoginPage.tsx";
import RegisterPage from "pages/RegisterPage/RegisterPage.tsx";
import ClimbersListPage from "pages/ClimbersListPage/ClimbersListPage.tsx";
import ClimberPage from "pages/ClimberPage/ClimberPage.tsx";
import ExpeditionsPage from "pages/ExpeditionsPage/ExpeditionsPage.tsx";
import ExpeditionPage from "pages/ExpeditionPage/ExpeditionPage.tsx";
import ProfilePage from "pages/ProfilePage/ProfilePage.tsx";
import AccessDeniedPage from "pages/AccessDeniedPage/AccessDeniedPage.tsx";
import NotFoundPage from "pages/NotFoundPage/NotFoundPage.tsx";
import Header from "components/Header/Header.tsx";
import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs.tsx";
import ClimbersTablePage from "pages/ClimbersTablePage/ClimbersTablePage.tsx";
import ClimberEditPage from "pages/ClimberEditPage/ClimberEditPage.tsx";
import ClimberAddPage from "pages/ClimberAddPage/ClimberAddPage.tsx";

function App() {
    return (
        <div>
            <Header />
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs />
                </Row>
                <Row>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login/" element={<LoginPage />} />
                        <Route path="/register/" element={<RegisterPage />} />
                        <Route path="/climbers/" element={<ClimbersListPage />} />
                        <Route path="/climbers-table/" element={<ClimbersTablePage />} />
                        <Route path="/climbers/:id/" element={<ClimberPage />} />
                        <Route path="/climbers/:id/edit" element={<ClimberEditPage />} />
                        <Route path="/climbers/add" element={<ClimberAddPage />} />
                        <Route path="/expeditions/" element={<ExpeditionsPage />} />
                        <Route path="/expeditions/:id/" element={<ExpeditionPage />} />
                        <Route path="/profile/" element={<ProfilePage />} />
                        <Route path="/403/" element={<AccessDeniedPage />} />
                        <Route path="/404/" element={<NotFoundPage />} />
                        <Route path='*' element={<NotFoundPage />} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
