import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { closeJobDialog } from "./JobDialogSlice";
import { useSelector } from "react-redux";
import DistributedChart from "@/app/(control-panel)/job/components/DistributedChart";
import { IconButton } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useThemeMediaQuery } from "@fuse/hooks";

export default function JobDialog() {
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("md"));
  const jobDetail = useSelector((state: any) => state?.jobs?.jobSlice?.detail);
  const [refresh, toggleRefresh] = React.useState(false);
  const dialogProps = useSelector(
    (state: any) => state.jobs?.jobDialogSlice?.props
  );

  const handleClose = () => {
    dispatch(closeJobDialog(null));
  };

  return (
    <React.Fragment>
      <Dialog
        {...dialogProps}
        fullWidth
        fullScreen={isMobile}
        maxWidth="md"
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "6px",
          },
        }}
      >
        <div className="w-full items-center justify-between flex rounded-sm">
          <div className="flex w-full p-3 items-center justify-between">
            <div className="text-xl font-semibold">
              Distribution Visualization ({jobDetail?.distribution_type})
            </div>
            <div className="flex items-center justify-end">
              <IconButton
                className=""
                onClick={() => toggleRefresh((prev) => !prev)}
              >
                <FuseSvgIcon className="text-7xl" size={22} color="primary">
                  heroicons-outline:arrow-path
                </FuseSvgIcon>
              </IconButton>
              <IconButton onClick={handleClose}>
                <FuseSvgIcon
                  className="text-7xl mr-2"
                  size={22}
                  color="primary"
                >
                  heroicons-outline:arrows-pointing-in
                </FuseSvgIcon>
              </IconButton>
            </div>
          </div>
        </div>
        <DialogContent>
          <Box className="flex items-center justify-center w-full">
            <DistributedChart refresh={refresh} toggleRefresh={toggleRefresh} />
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
