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
      }}
    >
      {Editor}
    </Box>
  );
};

export default EditBlog;
