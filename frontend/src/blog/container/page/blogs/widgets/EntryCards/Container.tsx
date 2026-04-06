import EntryCard from "../../../../../presentation/EntryCards/EntryCard";
import { useGenerateProps } from "./useGenerateProps";

export const EntryCardsContainer = () => {
    const generatedProps = useGenerateProps();
    return (
        <EntryCard {...generatedProps} />
    );
}