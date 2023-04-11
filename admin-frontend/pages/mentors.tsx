import { Button, Paper, Typography } from '@mui/material'
import { NextPage } from 'next'
import { useState } from 'react'
import { MdAdd } from 'react-icons/md'
import styled from 'styled-components'
import AddMentorModal from '../components/pages/mentors/addMentorModal'
import Modal from '../components/shared/Modal'
import {
  getMentorUsers,
  MentorUser,
  MentorUserBackendFields,
  MentorUserViewsFields,
  saveMentorUsers,
} from '../api/backend/mentorUsers'
import { deleteUsers } from '../api/backend/users'
import DataGrid from '../components/shared/datagrid/datagrid'
import {
  OnLoadColumnValueOptionsFunc,
  onLoadPagedDataRowsFunc,
  onSaveDataRowsFunc,
} from '../components/shared/datagrid/datagridTypes'
import { getMentorRoles, MentorRole } from '../api/backend/mentorRoles'

const Mentors: NextPage = () => {
  const [showAddMentorModal, setShowAddMentorModal] = useState(false)
  const [dataGridKey, setDataGridKey] = useState<number>(1)
  const PAGE_LIMIT = 5

  const loadMentorUserDataRows: onLoadPagedDataRowsFunc = async ({
    searchText,
    dataFieldsToSearch,
    limit,
    offset,
  }) => {
    const mentorsData = await getMentorUsers({
      searchText,
      dataFieldsToSearch,
      limit,
      offset,
      includeDataFromViews: true,
    })

    if (mentorsData) {
      const mentorDataRows = mentorsData.results as (MentorUserBackendFields &
        MentorUserViewsFields)[]

      return {
        count: mentorsData.count,
        results: mentorDataRows.map((mentor) => ({
          user_id: mentor.user_id,
          email: mentor.user.email,
          firstName: mentor.firstName,
          lastName: mentor.lastName,
          mentorRole_id: mentor.mentorRole ? mentor.mentorRole.id : '',
        })),
      }
    } else {
      throw 'Failed to get mentor user data'
    }
  }

  const onLoadMentorRoleOptions: OnLoadColumnValueOptionsFunc = async () => {
    const mentorRoles = (await getMentorRoles()) as MentorRole[] | null
    if (mentorRoles) {
      return mentorRoles.map((mentorRole) => ({
        id: mentorRole.id,
        name: mentorRole.name,
      }))
    } else {
      throw 'Failed to get mentor role options'
    }
  }

  const saveMentorUserDataRows: onSaveDataRowsFunc<MentorUser> = async (
    createdRows,
    updatedRows,
    deletedRows
  ) => {
    let successfulSave = true

    if (updatedRows.length > 0) {
      const updateRes = await saveMentorUsers(updatedRows)
      if (!updateRes) {
        successfulSave = false
      }
    }

    if (deletedRows.length > 0) {
      const delRes = await deleteUsers(deletedRows.map((row) => row.user_id))
      if (!delRes || delRes.status !== 200) {
        successfulSave = false
      }
    }

    return successfulSave
  }

  return (
    <>
      <Paper>
        <Header>
          <Typography padding="0.75rem" variant="h5">
            Mentors
          </Typography>
          <Button
            color="primary"
            variant="contained"
            style={{
              padding: '0.3rem 0.6rem 0.3rem 0.6rem',
              height: 'fit-content',
              margin: '0.6rem 0.6rem 0 0',
            }}
            onClick={() => {
              setShowAddMentorModal(true)
            }}
          >
            <MdAdd size="2rem"></MdAdd>
            Add Mentor
          </Button>
        </Header>
        <DataGrid
          key={`${dataGridKey}`}
          onLoadDataRows={loadMentorUserDataRows}
          onSaveDataRows={saveMentorUserDataRows}
          cols={[
            {
              header: 'Email',
              dataField: 'email',
              disableEditing: true,
              keepColumnOnMobile: true,
            },
            {
              header: 'First Name',
              dataField: 'firstName',
              disableEditing: true,
              enableSearching: true,
            },
            {
              header: 'Last Name',
              dataField: 'lastName',
              disableEditing: true,
              enableSearching: true,
            },
            {
              header: 'Mentor Role',
              dataField: 'mentorRole_id',
              onLoadValueOptions: onLoadMentorRoleOptions,
            },
          ]}
          pageSize={PAGE_LIMIT}
          disableDataRowCreation={true}
          primaryKeyDataField="user_id"
        ></DataGrid>
      </Paper>
      <Modal
        isOpen={showAddMentorModal}
        onOutsideClick={() => {
          setShowAddMentorModal(false)
          setDataGridKey(dataGridKey + 1)
        }}
        modalComponent={
          <AddMentorModal
            onOutsideClick={() => {
              setShowAddMentorModal(false)
              setDataGridKey(dataGridKey + 1)
            }}
          />
        }
        height="100vh"
      ></Modal>
    </>
  )
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

export default Mentors
