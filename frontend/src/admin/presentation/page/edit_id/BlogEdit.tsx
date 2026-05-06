import { Box } from '@mui/material';

export type EditBlogProps = {
  Editor: React.ReactNode;
};

const EditBlog = (props: EditBlogProps) => {
  const { Editor } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        mx: '-2rem',
        mt: '-2rem',
        px: '1.5rem',
        pt: '1.5rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {Editor}
    </Box>
  );
};

export default EditBlog;
