import {Container} from "reactstrap";
import notFoundImage from "src/assets/404.gif";

const NotFoundPage = () => {
    return (
        <Container className="d-flex flex-column justify-content-center">
            <h3 className="text-center">Страница не найдена</h3>
            <img src={notFoundImage} alt=""/>
        </Container>
    )
}

export default NotFoundPage