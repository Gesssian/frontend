import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteDraftExpedition,
    fetchExpedition,
    removeExpedition,
    sendDraftExpedition,
    triggerUpdateMM,
    updateExpedition
} from "store/slices/expeditionsSlice.ts";
import ClimberCard from "components/ClimberCard";
import {Button, Col, Form, Row} from "reactstrap";
import {E_ExpeditionStatus, T_Climber} from "src/utils/types.ts";
import CustomInput from "components/CustomInput";
import CustomDatePicker from "components/CustomDatePicker";

export const ExpeditionPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated)

    const expedition = useAppSelector((state) => state.expeditions.expedition)

    const [cost, setCost] = useState<string>(expedition?.cost)
    const [date, setDate] = useState<string>(expedition?.date)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/403/")
        }
    }, [isAuthenticated]);

    useEffect(() => {
        dispatch(fetchExpedition(id))
        return () => dispatch(removeExpedition())
    }, []);

    useEffect(() => {
        setCost(expedition?.cost)
        setDate(expedition?.date)
    }, [expedition]);

    const sendExpedition = async (e) => {
        e.preventDefault()

        const data = {
            cost
        }

        await dispatch(updateExpedition(data))
        await dispatch(sendDraftExpedition())

        navigate("/expeditions")
    }

    const saveExpedition = async (e) => {
        e.preventDefault()

        const data = {
            cost
        }

        await dispatch(updateExpedition(data))
        await dispatch(triggerUpdateMM())
    }

    const deleteExpedition = async () => {
        await dispatch(deleteDraftExpedition())
        navigate("/climbers")
    }

    if (!expedition) {
        return (
            <div>

            </div>
        )
    }

    const isDraft = expedition.status == E_ExpeditionStatus.Draft
    const isCompleted = expedition.status == E_ExpeditionStatus.Completed

    return (
        <Form onSubmit={sendExpedition} className="pb-5">
            <h2 className="mb-5">{isDraft ? "Черновая экспедиция" : `Экспедиция №${id}` }</h2>
            <Row className="mb-5 fs-5 w-25">
                <CustomInput label="Стоимость" placeholder="Введите стоимость" value={cost} setValue={setCost} disabled={!isDraft}/>
                {isCompleted && <CustomDatePicker label="Дата" value={date} disabled={true}/>}
            </Row>
            <Row>
                {expedition.climbers.length > 0 ? expedition.climbers.map((climber:T_Climber) => (
                    <Col md="4" key={climber.id} className="d-flex justify-content-center mb-5">
                        <ClimberCard climber={climber} showRemoveBtn={isDraft} showMM={true} editMM={isDraft} value={climber.count}/>
                    </Col>
                )) :
                    <h3 className="text-center">Альпинисты еще не добавлены</h3>
                }
            </Row>
            {isDraft &&
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