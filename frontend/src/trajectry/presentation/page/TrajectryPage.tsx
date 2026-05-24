import { Box } from "@mui/material";
import type { ReactNode } from "react";
import "./TrajectryPage.css";

type TrajectryPageProps = {
  Header: ReactNode;
  ImagePanel: ReactNode;
  MapArea: ReactNode;
  TrajectryDetail: ReactNode;
  TrajectryHeight: ReactNode;
  TrajectrySideBar: ReactNode;
  UploadModal: ReactNode;
};

export const TrajectryPage = ({
  Header,
  ImagePanel,
  MapArea,
  TrajectryDetail,
  TrajectryHeight,
  TrajectrySideBar,
  UploadModal,
}: TrajectryPageProps) => (
  <Box className="trajectry-page" component="main">
    {Header}
    <Box className="trajectry-page__body">
      {TrajectrySideBar}
      <Box className="trajectry-page__center" component="section">
        {MapArea}
        {TrajectryHeight}
      </Box>
      <Box className="trajectry-page__right" component="aside">
        {TrajectryDetail}
        {ImagePanel}
      </Box>
    </Box>
    {UploadModal}
  </Box>
);
