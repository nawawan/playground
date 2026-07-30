import {Stack, Typography, Paper, Chip} from "@mui/material";

export type EntryCardProps = {
    posts: {
        id: string,
        title: string,
        outline: string | undefined,
        elapsedTimeLabel: string | undefined,
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
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                        {post.title}
                    </Typography>
                    {post.elapsedTimeLabel && (
                        <Chip label={post.elapsedTimeLabel} size="small" />
                    )}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {post.outline}
                </Typography>
            </Paper>
            ))}
        </Stack>
    );
}

export default EntryCard;