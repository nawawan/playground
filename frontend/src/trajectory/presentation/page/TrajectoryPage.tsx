import { Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ReactNode } from "react";
import "./TrajectoryPage.css";

export type TrajectoryPageStatus = "loading" | "empty" | "ready";

type TrajectoryPageProps = {
  status: TrajectoryPageStatus;
  Header: ReactNode;
  ImagePanel: ReactNode;
  MapArea: ReactNode;
  TrajectoryDetail: ReactNode;
  TrajectoryHeight: ReactNode;
  TrajectorySideBar: ReactNode;
  UploadModal: ReactNode;
};

const STATUS_LABEL: Record<Exclude<TrajectoryPageStatus, "ready">, string> = {
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

export const TrajectoryPage = ({
  status,
  Header,
  ImagePanel,
  MapArea,
  TrajectoryDetail,
  TrajectoryHeight,
  TrajectorySideBar,
  UploadModal,
}: TrajectoryPageProps) => (
  <PageRoot className="trajectory-page">
    {Header}
    <PageBody direction="row">
      {TrajectorySideBar}
      {status === "ready" ? (
        <>
          <CenterColumn>
            {MapArea}
            {TrajectoryHeight}
          </CenterColumn>
          <RightColumn>
            {TrajectoryDetail}
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
