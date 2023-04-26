import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import AxiosClient from './../../../../shared/plugins/axios'
import { ButtonCircle } from './../../../../shared/components/ButtonCircle'
import { Loading } from './../../../../shared/components/Loading'
import { FilterComponent } from './../../../../shared/components/FilterComponent'
import { TiposForm } from './components/TiposForm'

import Alert, {
    confirmMsg, confirmTitle, errorMsg, errorTitle, successMsg, successTitle
} from './../../../../shared/plugins/alert'

const options = {
    rowsPerPageText: 'Registros por página',
    rangeSeparatorText: 'de'
}

export const TiposScreen = () => {
    const [tipos, setTipos] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterText, setFilterText] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const filteredTipos = tipos.filter(
        tipo => tipo.name && tipo.name.toLowerCase().includes(filterText.toLowerCase())
    )

    const getTipos = async () => {
        try {
            setIsLoading(true)
            const data = await AxiosClient({ url: '/type/' })
            if (!data.error) setTipos(data.data)
        } catch (error) {
            //poner alerta de error
        } finally {
            setIsLoading(false)
        }
    }
    //Se ejecuta después del return
    useEffect(() => {
        getTipos()
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
                        url: '/type/',
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
                    getTipos()
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
        width: '100px'
    },
    {
        name: 'Nombre del Tipo de Área',
        cell: (row) => <div>{row.name}</div>,
        sortable: true,
        selector: (row) => row.name
    },
    ],[])
    return <Card>
        <Card.Header>
            <Row>
                <Col sm={11} className='text-end'><center><b>Tipos de Áreas de la Universidad</b></center></Col>
                <Col sm={1} className='text-end'>
                    <ButtonCircle
                        type={'btn btn-outline-success'}
                        onClick={() => setIsOpen(true)}
                        icon='plus'
                        size={16}
                    />
                    <TiposForm
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        setTipos={setTipos}
                    />
                </Col>
            </Row>
        </Card.Header>
        <Card.Body>
            <DataTable
                columns={columns}
                data={filteredTipos}
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
export default TiposScreen;

