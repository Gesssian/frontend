import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {T_Climber} from "modules/types.ts";
// import {isHomePage, isClimberPage} from "utils/utils.ts";

interface BreadcrumbsProps {
    selectedClimber: T_Climber | null
}

const Breadcrumbs = ({ selectedClimber }: BreadcrumbsProps) => {

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
                        { selectedClimber?.name }
                    </Link>
                </BreadcrumbItem>
            }
			<BreadcrumbItem />
        </Breadcrumb>
    );
};

export default Breadcrumbs