import {Container} from "reactstrap";
import accessDeniedImage from "src/assets/403.gif"

const AccessDeniedPage = () => {
    return (
        <Container className="d-flex flex-column justify-content-center">
            <h3 className="text-center">Нет доступа</h3>
            <img src={accessDeniedImage} alt=""/>
        </Container>
    )
}

export default AccessDeniedPage