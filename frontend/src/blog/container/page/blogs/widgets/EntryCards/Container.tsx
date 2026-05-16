import { Box, CircularProgress } from "@mui/material";
import EntryCard from "../../../../../presentation/EntryCards/EntryCard";
import { useGenerateProps } from "./useGenerateProps";

export const EntryCardsContainer = () => {
    const { isLoading, ...generatedProps } = useGenerateProps();
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    return <EntryCard {...generatedProps} />;
}

export default EntryCardsContainer;