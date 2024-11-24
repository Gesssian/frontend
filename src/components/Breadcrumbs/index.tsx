import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {T_Climber} from "modules/types.ts";

type Props = {
    selectedClimber: T_Climber | null
}

const Breadcrumbs = ({selectedClimber}:Props) => {

    const location = useLocation()

    return (
        <Breadcrumb className="fs-5">
			{location.pathname == "/" &&
				<BreadcrumbItem>
					<Link to="/">
						Главная
					</Link>
				</BreadcrumbItem>
			}
			{location.pathname.includes("/climbers") &&
                <BreadcrumbItem active>
                    <Link to="/climbers">
						Альпинисты
                    </Link>
                </BreadcrumbItem>
			}
            {selectedClimber &&
                <BreadcrumbItem active>
                    <Link to={location.pathname}>
                        { selectedClimber.name }
                    </Link>
                </BreadcrumbItem>
            }
			<BreadcrumbItem />
        </Breadcrumb>
    );
};

export default Breadcrumbs