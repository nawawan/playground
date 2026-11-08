import { Alert, Avatar, Box, Button, Stack, TextField, Typography } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";

export type AdminProfileProps = {
  values: {
    thumbnail: string;
    summary: string;
    place: string;
  };
  isSaving?: boolean;
  isUploading?: boolean;
  // 保存結果の通知。undefined = 非表示
  notice?: { type: "success" | "error"; message: string };
  onThumbnailSelect?: (file: File) => void;
  onThumbnailClear?: () => void;
  onPlaceChange?: (value: string) => void;
  onSummaryChange?: (value: string) => void;
  onSave?: () => void;
  onBlogsClick?: () => void;
};

function AdminProfile(props: AdminProfileProps) {
  const {
    values,
    isSaving,
    isUploading,
    notice,
    onThumbnailSelect,
    onThumbnailClear,
    onPlaceChange,
    onSummaryChange,
    onSave,
    onBlogsClick,
  } = props;

  return (
    <Box sx={{ p: 4, maxWidth: 720, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" fontWeight={600}>
          プロフィール
        </Typography>
        <Button variant="outlined" startIcon={<ArticleIcon />} onClick={onBlogsClick}>
          ブログ管理へ
        </Button>
      </Box>

      <Stack spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={values.thumbnail || undefined} sx={{ width: 112, height: 112 }} />
          <Stack direction="row" spacing={1}>
            <Button component="label" variant="outlined" disabled={isUploading}>
              {isUploading ? "アップロード中..." : "画像を選択"}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onThumbnailSelect?.(file);
                  // 同じファイルを再選択しても change が発火するようにリセットする
                  e.target.value = "";
                }}
              />
            </Button>
            <Button color="inherit" disabled={!values.thumbnail || isUploading} onClick={onThumbnailClear}>
              削除
            </Button>
          </Stack>
        </Stack>

        <TextField
          label="所属・拠点"
          value={values.place}
          onChange={(e) => onPlaceChange?.(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 100 } }}
        />
        <TextField
          label="自己紹介・経歴"
          value={values.summary}
          onChange={(e) => onSummaryChange?.(e.target.value)}
          multiline
          minRows={8}
          slotProps={{ htmlInput: { maxLength: 10000 } }}
        />

        {notice && <Alert severity={notice.type}>{notice.message}</Alert>}

        <Box>
          <Button variant="contained" onClick={onSave} disabled={isSaving || isUploading}>
            {isSaving ? "保存中..." : "保存"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default AdminProfile;
