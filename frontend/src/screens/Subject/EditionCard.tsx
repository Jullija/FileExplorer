import { useNavigate } from 'react-router-dom';
import { Edition } from '../../utils/types';
import { pathGenerator } from '../../router/paths';
import { colors } from '../../utils/colors';
import { Button } from 'semantic-ui-react';
import { subtitleFontSize } from '../../utils/sizes';
import { useState } from 'react';
import { deleteEdition } from '../../api/editions';
import axios from 'axios';

interface EditionCardProps {
  edition: Edition;
  subjectId: number;
  withBottomBorder: boolean;
}

// TODO: subject will not update after delete -> refresh page needed
const EditionCard = ({ edition, subjectId, withBottomBorder }: EditionCardProps) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<boolean>(false);
  const handleDelete = async () => {
    try {
      await deleteEdition(subjectId, edition.id);
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

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottom: withBottomBorder ? '1px solid ' + colors.grey : 'none',
        color: colors.darkblue,
        transform: 'opacity 0.3s'
      }}>
      <div
        style={{
          fontSize: subtitleFontSize,
          opacity: hovered ? '0.7' : '1'
        }}>
        {edition.name}
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <Button
          style={{ backgroundColor: colors.orange, color: colors.darkblue }}
          onClick={() => navigate(pathGenerator.Edition(subjectId, edition.id))}>
          edit
        </Button>

        <Button
          style={{ backgroundColor: colors.grey, color: colors.darkblue }}
          onClick={handleDelete}>
          delete
        </Button>
      </div>
    </div>
  );
};

export default EditionCard;
