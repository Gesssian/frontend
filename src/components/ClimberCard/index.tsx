import {Button, Card, CardBody, CardImg, CardText, CardTitle} from "reactstrap";
import mockImage from "assets/mock.png";
import {Link} from "react-router-dom";
import {T_Climber} from "modules/types.ts";

interface ClimberCardProps {
    climber: T_Climber,
    isMock: boolean
}

const ClimberCard = ({climber, isMock}: ClimberCardProps) => {
    return (
        <Card key={climber.id} style={{width: '18rem', margin: "0 auto 50px" }}>
            <CardImg
                src={isMock ? mockImage as string : climber.image}
                style={{"height": "200px"}}
            />
            <CardBody>
                <CardTitle tag="h5">
                    {climber.name}
                </CardTitle>
                <CardText>
                    Покорил: {climber.peak}.
                </CardText>
                <Link to={`/climbers/${climber.id}`}>
                    <Button color="primary">
                        Открыть
                    </Button>
                </Link>
            </CardBody>
        </Card>
    );
};

export default ClimberCard