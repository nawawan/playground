import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
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

const PageRoot = styled(Stack)({
  background: "var(--paper)",
  color: "var(--ink)",
  fontFamily: '"Zen Kaku Gothic New", sans-serif',
  height: "100vh",
  inset: 0,
  overflow: "hidden",
  position: "fixed",
  textAlign: "left",
  width: "100vw",
  zIndex: 1,
});

const PageBody = styled(Stack)({
  flex: 1,
  minHeight: 0,
  "@media (max-width: 860px)": {
    overflowX: "auto",
  },
});

const CenterColumn = styled(Stack)({
  flex: 1,
  minWidth: 0,
  "@media (max-width: 860px)": {
    minWidth: 520,
  },
});

const RightColumn = styled(Stack)({
  background: "var(--paper)",
  borderLeft: "1px solid var(--rule)",
  flexShrink: 0,
  overflow: "hidden",
  width: 360,
  "@media (max-width: 1100px)": {
    width: 290,
  },
});

export const TrajectryPage = ({
  Header,
  ImagePanel,
  MapArea,
  TrajectryDetail,
  TrajectryHeight,
  TrajectrySideBar,
  UploadModal,
}: TrajectryPageProps) => (
  <PageRoot className="trajectry-page">
    {Header}
    <PageBody className="trajectry-page__body" direction="row">
      {TrajectrySideBar}
      <CenterColumn className="trajectry-page__center">
        {MapArea}
        {TrajectryHeight}
      </CenterColumn>
      <RightColumn className="trajectry-page__right">
        {TrajectryDetail}
        {ImagePanel}
      </RightColumn>
    </PageBody>
    {UploadModal}
  </PageRoot>
);
