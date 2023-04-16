import React from 'react'
import { useFormik } from 'formik'
import { Button, Col, Row, Form, Modal, FormControl } from 'react-bootstrap'
import * as yup from 'yup'
import AxiosClient from './../../../../../shared/plugins/axios'
import FeatherIcon from 'feather-icons-react'
import Alert, {
    confirmMsg, confirmTitle, errorMsg, errorTitle, successMsg, successTitle
} from './../../../../../shared/plugins/alert'


export const DowlandDocentes = ({ isOpen, onClose }) => {
    const form = useFormik({
        onSubmit: async (values) => {
            Alert.fire({
                title: confirmTitle,
                text: confirmMsg,
                icon: 'warning',
                confirmButtonColor: '#009574',
                confirmButtonText: 'Aceptar',
                cancelButtonColor: '#DD6B55',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                backdrop: true,
                showCancelButton: true,
                showLoaderOnConfirm: true,
                allowOutsideClick: () => !Alert.isLoading,
                preConfirm: async () => {
                    try {
                        const response = await AxiosClient({
                            method: 'GET',
                            url: '/reports/TeacherList/pdf/',
                            data: JSON.stringify(values),
                        }) 
                        if (!response.error) {
                            Alert.fire({
                                title: successTitle,
                                text: successMsg,
                                icon: 'success',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'Aceptar'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    handleClose()
                                }
                            })
                        }
                        return response
                    } catch (error) {
                        Alert.fire({
                            title: errorTitle,
                            text: errorMsg,
                            icon: 'error',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Aceptar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                handleClose()
                            }
                        })
                    }
                }

            })
        }
    })

    const handleClose = () => {
        form.resetForm()
        onClose()
    }

    return (
    <Modal
        backdrop='static'
        keyboard={false}
        show={isOpen}
        onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Descargar lista de los Docentes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={form.handleSubmit}>
                <Form.Group className='mb-3'>
                    <Row>
                        <Col className='text-end'>
                            <Button className='me-2' variant='outline-danger' onClick={handleClose}>
                                <FeatherIcon icon='x'/>&nbsp;Cerrar
                            </Button>
                            <Button type='submit' variant='outline-success'>
                                <FeatherIcon icon='check'/>&nbsp;Guardar
                            </Button>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
        </Modal.Body>
    </Modal>)
}
