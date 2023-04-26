import { Modal, Spinner } from 'react-bootstrap';

export const Loading = ({ isLoading, text="Cargando" }) => {

    return (
        <>
            <Modal show={isLoading} backdrop='static' keyboard={false} centered style={{ backgroundColor: '#0007' }} >
                <Modal.Body  className='p-5 '>
                    <div className='d-flex align-content-center justify-content-center mt-4'>

                        <div>
                            <Spinner animation='border' role='status' variant='primary'>
                                <span className='visually-hidden'>Loading...</span>
                            </Spinner>
                        </div>
                    </div>
                    <h3 className='text-center mt-3 text-primary'>{text}</h3>
                </Modal.Body>

            </Modal>
        </>
    );
}
