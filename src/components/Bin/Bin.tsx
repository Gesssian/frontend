import {Link} from "react-router-dom";
import {Badge, Button} from "reactstrap";

type Props = {
    isActive: boolean,
    draft_expedition_id: string,
    climbers_count: number
}

const Bin = ({isActive, draft_expedition_id, climbers_count}:Props) => {

    if (!isActive) {
        return <Button color={"secondary"} className="bin-wrapper" disabled>Корзина</Button>
    }

    return (
        <Link to={`/expeditions/${draft_expedition_id}/`} className="bin-wrapper">
            <Button color={"primary"} className="w-100 bin">
                Корзина
                <Badge>
                    {climbers_count}
                </Badge>
            </Button>
        </Link>
    )
}

export default Bin