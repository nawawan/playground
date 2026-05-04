import {Stack, Typography, Paper} from "@mui/material";

export type EntryCardProps = {
    posts: {
        id: string,
        title: string,
        outline: string | undefined,
    }[],
    onClick: (id: string) => void,
};

export const EntryCard = (props: EntryCardProps) => {
    const { posts, onClick } = props;
    return (
        <Stack spacing={2}>
            {posts.map((post) => (
            <Paper
                key={post.id}
                elevation={0}
                sx={{
                  bgcolor: "grey.300",
                  px: 2,
                  py: 2,
                }}
                onClick={() => onClick(post.id)}
                >
                <Typography variant="subtitle1" fontWeight={600}>
                    {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.outline}
                </Typography>
            </Paper>
            ))}
        </Stack>
    );
}

export default EntryCard;