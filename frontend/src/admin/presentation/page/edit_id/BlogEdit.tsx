import { Box, Button, ButtonBase, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";



export type EditBlogProps = {
  Editor: React.ReactNode;
};

const EditBlog = (props: EditBlogProps) => {
  const { Editor } = props;
  return (
    <>
      {Editor}
    </>
  );
}

export default EditBlog;
