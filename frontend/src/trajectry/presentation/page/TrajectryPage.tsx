import { Stack } from "@mui/material";
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
  <Stack className="trajectry-page" component="main">
    {Header}
    <Stack className="trajectry-page__body" direction="row">
      {TrajectrySideBar}
      <Stack className="trajectry-page__center" component="section">
        {MapArea}
        {TrajectryHeight}
      </Stack>
      <Stack className="trajectry-page__right" component="aside">
        {TrajectryDetail}
        {ImagePanel}
      </Stack>
    </Stack>
    {UploadModal}
  </Stack>
);
