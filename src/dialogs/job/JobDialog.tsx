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

export default function JobDialog() {
  const dispatch = useDispatch<AppDispatch>();
  const jobDetail = useSelector((state: any) => state?.jobs?.jobSlice?.detail);
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
        maxWidth="md"
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "6px"
          }
        }}
      >
        <div className="w-full items-center justify-between flex rounded-sm">
          <DialogTitle className="text-xl font-semibold">
            Distribution Visualization ({jobDetail?.distribution_type}){" "}
          </DialogTitle>
          <DialogActions>
            <IconButton className="mx-2">
              <FuseSvgIcon className="text-7xl" size={22} color="primary">
                heroicons-outline:arrow-path
              </FuseSvgIcon>
            </IconButton>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </div>
        <DialogContent>
          <Box className="flex items-center justify-center w-full mt-10">
            <DistributedChart />
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
