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
