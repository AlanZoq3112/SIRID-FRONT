import FeatherIcon from 'feather-icons-react'
import React from 'react'
import { Col, FormControl, InputGroup, Row } from 'react-bootstrap'

export const FilterComponent = ({filterText, onFilter, onClear}) => {
  return (
    <Row>
        <Col>
        <InputGroup className='mb-3'>
            <FormControl
                id='search'
                placeholder='Buscar...'
                aria-label='Buscar...'
                value={filterText}
                onChange={onFilter}
            />
            <InputGroup.Text onClick={onClear}>
                <FeatherIcon icon={'x'}/>
            </InputGroup.Text>
        </InputGroup>
        </Col>
    </Row>
  )
}
