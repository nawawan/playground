
import { Box, Button, Divider, Stack } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";
import ToggleButton from "../../../presentation/primitive/ToggleButton/ToggleButton";

export type SidebarProps = {
    years: string[],
    additionalYears? : string[],
    onClickGitHub?: () => void,
    onClickX?: () => void,
    onCkickHome?: () => void,
    onClickYear?: (year: string) => void;
};

function Sidebar(props: SidebarProps) {
    const { years, additionalYears, onClickGitHub, onClickX, onCkickHome } = props;

    return (
        <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
                <HomeOutlinedIcon onClick={onCkickHome} />
                <GitHubIcon onClick={onClickGitHub} />
                <XIcon onClick={onClickX} />
            </Stack>
        
            <Divider />
        
            <Stack component="ul" sx={{ m: 0, p: 0 }}>
                {years.map((year) => (
                    <Box component="li" key={year} sx={{ listStyle: "none" }}>
                        <Button onClick={() => props.onClickYear?.(year)}>
                            {year}
                        </Button>
                    </Box>
                ))}
            </Stack>
            {additionalYears && 
                <ToggleButton additionalContents={additionalYears} />
            }
        </Stack>
    )
};

export default Sidebar;