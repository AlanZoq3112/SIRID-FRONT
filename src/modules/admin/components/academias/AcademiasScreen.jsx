import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Badge } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import AxiosClient from './../../../../shared/plugins/axios'
import { ButtonCircle } from './../../../../shared/components/ButtonCircle'
import { Loading } from './../../../../shared/components/Loading'
import { FilterComponent } from './../../../../shared/components/FilterComponent'
import { AcademiasForm } from './components/AcademiasForm'
import { EditAcademiasForm } from './components/EditAcademiasForm'

import Alert, {
    confirmMsg, confirmTitle, errorMsg, errorTitle, successMsg, successTitle
} from './../../../../shared/plugins/alert'

const options = {
    rowsPerPageText: 'Registros por página',
    rangeSeparatorText: 'de'
}

export const AcademiasScreen = () => {
    const [academias, setAcademias] = useState([])
    const [selectedAcademia, setSelectedAcademia] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [filterText, setFilterText] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const filteredAcademias = academias.filter(
        academia => academia.name && academia.name.toLowerCase().includes(filterText.toLowerCase())
    )

    const getAcademias = async () => {
        try {
            setIsLoading(true)
            const data = await AxiosClient({ url: '/academic/' })
            if (!data.error) setAcademias(data.data)
        } catch (error) {
            //poner alerta de error
        } finally {
            setIsLoading(false)
        }
    }
    //Se ejecuta después del return
    useEffect(() => {
        getAcademias()
    }, [])
    /*Recibe una dependencia, si está vacío solo se renderiza una vez, si no, se ejecuta cada que haya un cambio en la dependencia*/

    const enableOrDisable = (row) => {
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
                row.status = !row.status
               
                try {
                    const response = await AxiosClient({
                        method: 'PATCH',
                        url: '/academic/',
                        data: JSON.stringify(row),
                    })
                    if (!response.error) {
                        Alert.fire({
                            title: successTitle,
                            text: successMsg,
                            icon: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Aceptar'
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
                    })
                } finally {
                    getAcademias()
                }
            }
        })
    }

    const headerComponent = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) setFilterText('')
        }
        return (
            <FilterComponent
                onFilter={(e) => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
            />
        )
    }, [filterText])

    const columns = React.useMemo(() => [{
        name: '#',
        cell: (row, index) => <div>{index + 1}</div>,
        sortable: true,
    },
    {
        name: 'Academia',
        cell: (row) => <div>{row.name}</div>,
        sortable: true,
        selector: (row) => row.name
    },

    {
        name: 'Acciones',
        cell: (row) => <>
            <ButtonCircle
                icon='edit'
                type={'btn btn-outline-warning btn-circle'}
                size={16}
                onClick={() => {
                    setIsEditing(true)
                    setSelectedAcademia(row)
                }}
            >

            </ButtonCircle>
            

        </>//fragment
    }
    ],[])
    return <Card>
        <Card.Header>
            <Row>
                <Col>Academias Universitarias</Col>
                <Col className='text-end'>
                    <ButtonCircle
                        type={'btn btn-outline-success'}
                        onClick={() => setIsOpen(true)}
                        icon='plus'
                        size={16}
                    />
                    <AcademiasForm
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        setAcademias={setAcademias}
                    />
                    <EditAcademiasForm
                        isOpen={isEditing}
                        onClose={() => setIsEditing(false)}
                        setAcademias={setAcademias}
                        academia={selectedAcademia}
                    />
                </Col>
            </Row>
        </Card.Header>
        <Card.Body>
            <DataTable
                columns={columns}
                data={filteredAcademias}
                progressPending={isLoading}
                progressComponent={<Loading />}
                noDataComponent={'Sin registros'}
                pagination
                paginationComponentOptions={options}
                subHeader
                subHeaderComponent={headerComponent}
                persistTableHead
                striped={true}
                highlightOnHover={true}

            />
        </Card.Body>
    </Card>
}
export default AcademiasScreen;

