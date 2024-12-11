import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteClimber,
    fetchClimber,
    removeSelectedClimber,
    updateClimber,
    updateClimberImage
} from "store/slices/climbersSlice.ts";
import UploadButton from "components/UploadButton/UploadButton.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import CustomTextarea from "components/CustomTextarea/CustomTextarea.tsx";

const ClimberEditPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const {climber} = useAppSelector((state) => state.climbers)

    const {is_superuser} = useAppSelector((state) => state.user)

    const [name, setName] = useState<string>(climber?.name)

    const [description, setDescription] = useState<string>(climber?.description)

    const [peak, setPeak] = useState<number>(climber?.peak)

    useEffect(() => {
        if (!is_superuser) {
            navigate("/403/")
        }
    }, [is_superuser]);

    const navigate = useNavigate()

    const [imgFile, setImgFile] = useState<File>()
    const [imgURL, setImgURL] = useState<string>(climber?.image)

    const handleFileChange = (e) => {
        if (e.target.files) {
            const file = e.target?.files[0]
            setImgFile(file)
            setImgURL(URL.createObjectURL(file))
        }
    }

    const saveClimber = async() => {
        if (imgFile) {
            const form_data = new FormData()
            form_data.append('image', imgFile, imgFile.name)
            await dispatch(updateClimberImage({
                climber_id: climber.id,
                data: form_data
            }))
        }

        const data = {
            name,
            description,
            peak
        }

        await dispatch(updateClimber({
            climber_id: climber.id,
            data
        }))

        navigate("/climbers-table/")
    }

    useEffect(() => {
        dispatch(fetchClimber(id))
        return () => dispatch(removeSelectedClimber())
    }, []);

    useEffect(() => {
        setName(climber?.name)
        setDescription(climber?.description)
        setPeak(climber?.peak)
        setImgURL(climber?.image)
    }, [climber]);

    const handleDeleteClimber = async () => {
        await dispatch(deleteClimber(id))
        navigate("/climbers-table/")
    }

    if (!climber) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <img src={imgURL} alt="" className="w-100"/>
                    <Container className="mt-3 d-flex justify-content-center">
                        <UploadButton handleFileChange={handleFileChange} />
                    </Container>
                </Col>
                <Col md={6}>
                    <CustomInput label="Имя" placeholder="Введите имя" value={name} setValue={setName}/>
                    <CustomTextarea label="Биография" placeholder="Введите биографию" value={description} setValue={setDescription}/>
                    <CustomInput label="Покорил" placeholder="Покорил" value={peak} setValue={setPeak}/>
                    <Col className="d-flex justify-content-center gap-5 mt-5">
                        <Button color="success" className="fs-4" onClick={saveClimber}>Сохранить</Button>
                        <Button color="danger" className="fs-4" onClick={handleDeleteClimber}>Удалить</Button>
                    </Col>
                </Col>
            </Row>
        </Container>
    );
};

export default ClimberEditPage