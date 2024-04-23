import { useNavigate } from 'react-router-dom';
import { Edition } from '../../utils/types';
import { pathGenerator } from '../../router/paths';
import { Button, Card, Dimmer, Form, Grid, Icon, Input, Loader, Modal } from 'semantic-ui-react';
import { useState } from 'react';
import { addTemplate } from '../../api/templates';
import axios from 'axios';
import { axiosClient } from '../../api/axiosClient';
import ConfirmationModal from '../../components/ConfirmationModal';

interface EditionCardProps {
  edition: Edition;
  subjectId: number;
  withBottomBorder: boolean;
  handleDeleteEdition: (editionId: number) => void;
  refetch: () => void;
}

const EditionCard = ({
  edition,
  subjectId,
  withBottomBorder,
  handleDeleteEdition,
  refetch
}: EditionCardProps) => {
  const navigate = useNavigate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [newEditionName, setNewEditionName] = useState(`${edition.name} copy`);
  const [newEditionYear, setNewEditionYear] = useState(edition.year);

  const duplicateEdition = async () => {
    try {
      // Assuming axiosClient is configured elsewhere
      await axiosClient.post('/editions/duplicate/', {
        base_edition_id: edition.id,
        new_edition_name: newEditionName,
        new_edition_year: newEditionYear
      });
      setShowDuplicateModal(false);
      refetch();
    } catch (error) {
      console.error('Failed to duplicate the edition:', error);
      alert('Error duplicating the edition.');
    }
  };

  const handleAddTemplate = async () => {
    try {
      await addTemplate(edition.id, edition.name, 'description');
    } catch (error) {
      navigate(
        pathGenerator.ErrorPage(
          axios.isAxiosError(error)
            ? JSON.stringify(error.response?.data)
            : 'Something went wrong :('
        )
      );
    }
  };
  const [loading, setLoading] = useState(false);

  const downloadEdition = async () => {
    setLoading(true);

    try {
      const response = await axiosClient({
        url: `/export-edition/${edition.id}`,
        method: 'GET',
        responseType: 'blob'
      });

      const contentDisposition = response.headers['content-disposition'];
      let filename = `${edition.name}.zip`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const blob = new Blob([response.data], { type: 'application/zip' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to download the file:', error);
      alert('Failed to download the file.');
    } finally {
      setLoading(false);
    }
  };
  const hasEditPermission = ['edit', 'owns', 'admin'].includes(edition.user_permission);
  const hasViewPermission = ['view'].includes(edition.user_permission);

  return (
    <Card fluid color={withBottomBorder ? 'grey' : undefined} style={{ padding: '20px' }}>
      <Card.Content>
        <Card.Header content={edition.name} />
        <Card.Meta content={`Year: ${edition.year}`} />
        <Card.Description>
          <Grid columns={2}>
            <Grid.Column>
              {!hasEditPermission && hasViewPermission && (
                <Button
                  icon
                  color="blue"
                  onClick={() => navigate(pathGenerator.Edition(subjectId, edition.id))}>
                  <Icon name="eye" /> View
                </Button>
              )}
              {hasEditPermission && (
                <Button
                  icon
                  color="orange"
                  onClick={() => navigate(pathGenerator.Edition(subjectId, edition.id))}>
                  <Icon name="edit" /> Edit
                </Button>
              )}
              {hasEditPermission && (
                <Button icon color="red" onClick={() => setShowConfirmationModal(true)}>
                  <Icon name="delete" /> Delete
                </Button>
              )}
            </Grid.Column>
            <Grid.Column textAlign="right">
              <Button color="teal" onClick={handleAddTemplate}>
                <Icon name="save" /> Save Template
              </Button>
              <Button color="grey" onClick={() => setShowDuplicateModal(true)}>
                <Icon name="copy" /> Copy Edition
              </Button>
              <Button color="olive" onClick={downloadEdition}>
                <Icon name="download" /> Download ZIP
              </Button>
              {/* Loading indicator */}
              <Dimmer active={loading} inverted>
                <Loader>Loading</Loader>
              </Dimmer>
            </Grid.Column>
          </Grid>
        </Card.Description>
      </Card.Content>

      <Modal open={showDuplicateModal} onClose={() => setShowDuplicateModal(false)} size="tiny">
        <Modal.Header>Duplicate Edition</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <label>Edition Name</label>
              <Input
                value={newEditionName}
                onChange={(e) => setNewEditionName(e.target.value)}
                placeholder="Enter new edition name"
              />
            </Form.Field>
            <Form.Field>
              <label>Edition Year</label>
              <Input
                type="number"
                value={newEditionYear}
                onChange={(e) => setNewEditionYear(parseInt(e.target.value, 10))}
                placeholder="Enter new edition year"
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setShowDuplicateModal(false)}>
            Cancel
          </Button>
          <Button color="green" onClick={duplicateEdition}>
            Duplicate
          </Button>
        </Modal.Actions>
      </Modal>
      <ConfirmationModal
        open={showConfirmationModal}
        onCloseClick={() => setShowConfirmationModal(false)}
        onConfirmClick={async () => {
          await handleDeleteEdition(edition.id);
          setShowConfirmationModal(false);
        }}
      />
    </Card>
  );
};

export default EditionCard;
