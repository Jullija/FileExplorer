import { useNavigate, useParams } from 'react-router-dom';
import { pathGenerator } from '../../router/paths';
import { Button, Form, FormField } from 'semantic-ui-react';
import { useState } from 'react';
import { titleFontSize } from '../../utils/sizes';
import { colors } from '../../utils/colors';
import axios from 'axios';

const AddEdition = () => {
  const params = useParams();
  const subjectId = Number(params.subjectId);

  const navigate = useNavigate();

  const [editionName, setEditionName] = useState<string>('');

  const handleCancel = () => {
    navigate(pathGenerator.subject(subjectId));
  };

  const handleConfrim = async () => {
    await axios
      .post(`http://127.0.0.1:8000/courses/${subjectId}/editions/`, {
        name: editionName,
        year: 2000
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    navigate(pathGenerator.subject(subjectId));
  };

  return (
    <div style={{ color: colors.darkblue }}>
      <div style={{ fontSize: titleFontSize, margin: '24px 20px' }}>
        Utwórz edycję dla przedmiotu
      </div>
      <Form style={{ width: 400 }}>
        <FormField>
          <label>Nazwa</label>
          <input placeholder="Nazwa edycji" onChange={(e) => setEditionName(e.target.value)} />
        </FormField>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button onClick={handleCancel} style={{ backgroundColor: colors.grey }}>
            anuluj
          </Button>
          <Button
            type="submit"
            onClick={handleConfrim}
            style={{ backgroundColor: colors.darkblue, color: colors.white }}>
            dodaj
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddEdition;
