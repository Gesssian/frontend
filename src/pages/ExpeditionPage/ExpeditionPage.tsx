import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteDraftExpedition,
    fetchExpedition,
    removeExpedition, sendDraftExpedition,
    triggerUpdateMM, updateExpedition
} from "store/slices/expeditionsSlice.ts";
import {Button, Col, Form, Row} from "reactstrap";
import {E_ExpeditionStatus, T_Climber} from "modules/types.ts";
import ClimberCard from "components/ClimberCard/ClimberCard.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";

const ExpeditionPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const {is_authenticated, is_superuser} = useAppSelector((state) => state.user)

    const expedition = useAppSelector((state) => state.expeditions.expedition)

    const [cost, setCost] = useState<string>(expedition?.cost)

    const [date, setDate] = useState<string>(expedition?.date)

    useEffect(() => {
        if (!is_authenticated) {
            navigate("/403/")
        }
    }, [is_authenticated]);

    useEffect(() => {
        is_authenticated && dispatch(fetchExpedition(id))
        return () => dispatch(removeExpedition())
    }, []);

    useEffect(() => {
        setCost(expedition?.cost)
        setDate(expedition?.date)
    }, [expedition]);

    const sendExpedition = async (e) => {
        e.preventDefault()

        await saveExpedition()

        await dispatch(sendDraftExpedition())

        navigate("/expeditions")
    }

    const saveExpedition = async (e?) => {
        e?.preventDefault()

        const data = {
            cost
        }

        await dispatch(updateExpedition(data))
        await dispatch(triggerUpdateMM())
        await dispatch(triggerUpdateMM())
    }

    const deleteExpedition = async () => {
        await dispatch(deleteDraftExpedition())
        navigate("/climbers")
    }

    if (!expedition) {
        return (
            <></>
        )
    }

    const isDraft = expedition.status == E_ExpeditionStatus.Draft
    const isCompleted = expedition.status == E_ExpeditionStatus.Completed

    return (
        <Form onSubmit={sendExpedition} className="pb-5">
            <h2 className="mb-5">{isDraft ? "Черновая экспедиция" : `Экспедиция №${id}` }</h2>
            <Row className="mb-5 fs-5 w-25">
                <CustomInput label="Стоимость" placeholder="Введите стоимость" value={cost} setValue={setCost} disabled={!isDraft || is_superuser}/>
                {isCompleted && <CustomInput label="Дата" value={date} disabled={true}/>}
            </Row>
            <Row>
                {expedition.climbers.length > 0 ? expedition.climbers.map((climber:T_Climber) => (
                    <Row key={climber.id} className="d-flex justify-content-center mb-5">
                        <ClimberCard climber={climber} showRemoveBtn={isDraft} editMM={isDraft}/>
                    </Row>
                )) :
                    <h3 className="text-center">Альпинисты не добавлены</h3>
                }
            </Row>
            {isDraft && !is_superuser &&
                <Row className="mt-5">
                    <Col className="d-flex gap-5 justify-content-center">
                        <Button color="success" className="fs-4" onClick={saveExpedition}>Сохранить</Button>
                        <Button color="primary" className="fs-4" type="submit">Отправить</Button>
                        <Button color="danger" className="fs-4" onClick={deleteExpedition}>Удалить</Button>
                    </Col>
                </Row>
            }
        </Form>
    );
};

export default ExpeditionPage