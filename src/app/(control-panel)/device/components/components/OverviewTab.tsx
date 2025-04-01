import {
  Box,
  Typography,
  Chip,
  styled,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";
import DeviceItem from "@/components/device/DeviceItem";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

const fakeDevices = [
  {
    id: "dev-001",
    created_at: 1743098696813,
    electricity_usage_kwh: 6206.73,
    voltage: 464,
    current: 416.78,
    last_seen: 1743272907607,
    isFollowed: true,
  },
  {
    id: "dev-002",
    created_at: 1743098696813,
    electricity_usage_kwh: 5102.35,
    voltage: 435,
    current: 398.42,
    last_seen: 1743272807607,
    isFollowed: false,
  },
  {
    id: "dev-003",
    created_at: 1743098696813,
    electricity_usage_kwh: 7304.21,
    voltage: 472,
    current: 425.16,
    last_seen: 1743272707607,
    isFollowed: false,
  },
  {
    id: "dev-004",
    created_at: 1743098696813,
    electricity_usage_kwh: 6789.48,
    voltage: 458,
    current: 412.93,
    last_seen: 1743272607607,
    isFollowed: true,
  },
  {
    id: "dev-005",
    created_at: 1743098696813,
    electricity_usage_kwh: 4987.62,
    voltage: 440,
    current: 402.27,
    last_seen: 1743272507607,
    isFollowed: false,
  },
];
// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
};

const StickyHeader = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  backgroundColor: theme.palette.background.default,
  zIndex: 10,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
}));
const OverviewTab = () => {
  const theme = useTheme();
  const [topics, setTopics] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const topicParam = searchParams.get("topic");
  const navigate = useNavigate();

  useEffect(() => {
    const fakeTopics = [
      { id: 1, name: "Area Q1", deviceCount: 12 },
      { id: 2, name: "Area Q4", deviceCount: 8 },
      { id: 3, name: "Area BT", deviceCount: 15 },
      { id: 4, name: "Area W5", deviceCount: 6 },
    ];
    setTopics(fakeTopics);
    if (!topicParam) navigate(`/device/overview?topic=${fakeTopics[0].name}`);
  }, []);

  useEffect(() => {
    if (topicParam) {
      setLoading(true);
      setTimeout(() => {
        setDevices([...fakeDevices, ...fakeDevices, ...fakeDevices]);
        setLoading(false);
      }, 300);
    }
  }, [topicParam]);

  return (
    <motion.div
      key="districts"
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full overflow-hidden"
    >
      <div className="flex justify-between gap-x-5 relative">
        <Box className="w-1/4">
          <Box className="flex items-center justify-between mb-4">
            <Typography className="font-semibold text-lg">
              Topics (Areas)
            </Typography>
          </Box>

          <AnimatePresence>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              {topics.map((topic) => {
                const updatedParams = new URLSearchParams(
                  window.location.search
                );
                updatedParams.set("topic", topic.name);
                return (
                  <motion.div key={topic.id} variants={itemVariants}>
                    <Box
                      role="button"
                      component={Link}
                      to={`/device/overview?${updatedParams.toString()}`}
                      className={`flex items-center justify-between px-4 py-4 cursor-pointer border-b`}
                      sx={{
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                        backgroundColor:
                          topicParam === topic.name
                            ? theme.palette.action.hover
                            : "",
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight={topicParam === topic.name ? 500 : 400}
                      >
                        {topic.name}
                      </Typography>
                      <Chip
                        size="small"
                        label={`${topic.deviceCount} devices`}
                        color={
                          topicParam === topic.name ? "secondary" : "default"
                        }
                      />
                    </Box>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </Box>

        <Box className="w-3/4 h-full rounded-md">
          <Box className="flex items-center justify-between mb-4 w-full h-full overflow-y-scroll scrollbar-hide">
            {loading ? (
              <FuseLoading />
            ) : !topicParam ? (
              <Box className="flex items-center justify-center w-full border border-dashed border-gray-400 rounded-md h-60">
                <Typography variant="body1" color="text.secondary">
                  Please select a topic from the left panel
                </Typography>
              </Box>
            ) : (
              <AnimatePresence>
                <motion.div
                  key="inactive"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full h-full"
                >
                  <div className="flex sticky top-0 items-stretch pt-1 mb-4 w-full">
                    <TextField
                      id="outlined-basic"
                      label="Search device"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          paddingTop: "0px",
                        },
                      }}
                      variant="outlined"
                      className="w-full rounded-sm border-none"
                    />
                    <Button
                      variant="contained"
                      className="rounded-sm ml-2"
                      sx={{ backgroundColor: theme.palette.action.hover }}
                    >
                      <FuseSvgIcon
                        className="text-7xl"
                        size={22}
                        color="action"
                      >
                        heroicons-outline:magnifying-glass
                      </FuseSvgIcon>
                    </Button>
                  </div>
                  <StickyHeader>
                    <motion.div
                      className="flex items-center font-semibold justify-between h-12 px-4 text-blue-600 uppercase"
                      initial={{ y: 0, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-2/12 pl-2">Device ID</div>
                      <div className="w-2/12">Usage</div>
                      <div className="w-3/12">Last seen</div>
                      <div className="w-2/12">Current</div>
                      <div className="w-3/12">Voltage</div>
                    </motion.div>
                  </StickyHeader>
                  <Box className="h-150 overflow-y-scroll scrollbar-hide">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col"
                    >
                      {devices?.map((device) => (
                        <DeviceItem key={device.id} device={device} />
                      ))}
                    </motion.div>
                  </Box>
                </motion.div>
              </AnimatePresence>
            )}
          </Box>
        </Box>
      </div>
    </motion.div>
  );
};

export default OverviewTab;
