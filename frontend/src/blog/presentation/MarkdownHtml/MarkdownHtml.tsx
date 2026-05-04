import { Box } from "@mui/material";

export type MarkdownHtmlProps = {
  htmlBody: string;
};

export const MarkdownHtml = (props: MarkdownHtmlProps) => {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: props.htmlBody }}
      sx={{
        lineHeight: 1.8,
        wordBreak: "break-word",

        "& h1, & h2, & h3, & h4, & h5, & h6": {
          fontWeight: 600,
          mt: 4,
          mb: 1,
          lineHeight: 1.3,
        },
        "& h1": { fontSize: "2rem" },
        "& h2": { fontSize: "1.5rem", borderBottom: "1px solid", borderColor: "grey.300", pb: 0.5 },
        "& h3": { fontSize: "1.25rem" },
        "& h4": { fontSize: "1rem" },

        "& p": { mt: 0, mb: 2 },

        "& a": {
          color: "primary.main",
          textDecoration: "underline",
          "&:hover": { opacity: 0.75 },
        },

        "& ul, & ol": { pl: 3, mb: 2 },
        "& li": { mb: 0.5 },

        "& blockquote": {
          borderLeft: "4px solid",
          borderColor: "grey.400",
          pl: 2,
          ml: 0,
          color: "text.secondary",
          fontStyle: "italic",
        },

        "& code": {
          fontFamily: "monospace",
          fontSize: "0.875em",
          bgcolor: "grey.100",
          px: 0.5,
          py: 0.25,
          borderRadius: 0.5,
        },

        "& pre": {
          bgcolor: "grey.900",
          color: "grey.100",
          p: 2,
          borderRadius: 1,
          overflowX: "auto",
          mb: 2,
          "& code": {
            bgcolor: "transparent",
            px: 0,
            py: 0,
            fontSize: "0.875rem",
            color: "inherit",
          },
        },

        "& img": {
          maxWidth: "100%",
          height: "auto",
          display: "block",
          my: 2,
        },

        "& table": {
          width: "100%",
          borderCollapse: "collapse",
          mb: 2,
        },
        "& th, & td": {
          border: "1px solid",
          borderColor: "grey.300",
          px: 1.5,
          py: 1,
        },
        "& th": {
          bgcolor: "grey.100",
          fontWeight: 600,
        },

        "& hr": {
          border: "none",
          borderTop: "1px solid",
          borderColor: "grey.300",
          my: 3,
        },
      }}
    />
  );
};

export default MarkdownHtml;
