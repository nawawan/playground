import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";
import "./TrajectryPage.css";

export type TrajectryPageStatus = "loading" | "empty" | "ready";

type TrajectryPageProps = {
  status: TrajectryPageStatus;
  Header: ReactNode;
  ImagePanel: ReactNode;
  MapArea: ReactNode;
  TrajectryDetail: ReactNode;
  TrajectryHeight: ReactNode;
  TrajectrySideBar: ReactNode;
  UploadModal: ReactNode;
};

const STATUS_LABEL: Record<Exclude<TrajectryPageStatus, "ready">, string> = {
  loading: "読み込み中…",
  empty: "アクティビティがありません",
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
  width: 320,
});

const StatusColumn = styled(Stack)({
  alignItems: "center",
  flex: 1,
  justifyContent: "center",
  minWidth: 0,
});

export const TrajectryPage = ({
  status,
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
    <PageBody direction="row">
      {TrajectrySideBar}
      {status === "ready" ? (
        <>
          <CenterColumn>
            {MapArea}
            {TrajectryHeight}
          </CenterColumn>
          <RightColumn>
            {TrajectryDetail}
            {ImagePanel}
          </RightColumn>
        </>
      ) : (
        <StatusColumn>
          <Typography sx={{ color: "var(--ink-soft)" }}>{STATUS_LABEL[status]}</Typography>
        </StatusColumn>
      )}
    </PageBody>
    {UploadModal}
  </PageRoot>
);
